import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';  
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from "sweetalert2";
import { dateDiffInDays, getDateFormat } from "src/app/service/globalFunction";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-up-list',
  templateUrl: './pick-up-list.component.html',
  styleUrls: ['./pick-up-list.component.css']
})
export class PickUpListComponent implements OnInit {

  // dtInstance!: DataTables.Api

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild('closebutton') closebutton:any;
  @ViewChild('mainForm') mainForm:any;

  modalRef: any = BsModalRef;
  public pickUpData : any = [];
  public storeData : any = [];
  public serviceBoyData : any = [];
  public filter : boolean = false;
  public selectedPickup: any = {};
  statusForm : FormGroup;
  boyAssignForm : FormGroup;
  allStatus=["New Order", "Pick Up assigned", "Order created", "Order picked", "Delivered","Cancelled"];
  pickId : any = '';
  submitted = false;

  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  constructor(private _api : ApiService, private _loader : NgxUiLoaderService, private modalService: BsModalService, private fbuilder : FormBuilder, private _route: Router) { 
    this.statusForm= this.fbuilder.group({
      status : new FormControl('',Validators.required)
    });
    this.boyAssignForm= this.fbuilder.group({
      boyAssign : new FormControl('',Validators.required),
      storeAssign : new FormControl('',Validators.required)
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.pickUpList();
      this.storeList();
      this.serviceBoyList();
      // this.dtOptions = {
      //   pagingType: 'full_numbers',
      //   pageLength: 10
      // };
      // this._api.getPickUpList().subscribe(
      //   res=>{
      //     console.log(res);       
      //     this.pickUpData = res.data;
      //     this.dtTrigger.next();
      //     this._loader.stopLoader('loader');
      //   },err=>{
      //     this._loader.stopLoader('loader');
      //   }
      // )
    } else {
      this._api.logoutUser();
    }
  }
  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }
  selectPickup(pickupId : any) {
    this.selectedPickup = [];
    this._api.getPickID(pickupId).subscribe(
      res => {
        this.selectedPickup = res.data;
        console.log(this.selectedPickup);
        
      }, err => {}
    )
    
  }
  
  pickUpList(){
    this._loader.startLoader('loader');
    this._api.getPickUpList().subscribe(
      res=>{
        console.log(res);       
        this.pickUpData = res.data;
        // this.dtTrigger.next();
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  storeList(){
    this._loader.startLoader('loader');
    this._api.getStoreList().subscribe(
      res=>{
        console.log(res);       
        this.storeData = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  serviceBoyList(){
    this._loader.startLoader('loader');
    this._api.getServiceBoyList().subscribe(
      res=>{
        console.log(res);       
        this.serviceBoyData = res.data.filter((e:any) => e.boy_type === 'Delivery Boy');
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deletePickUp(pick_id:any){
    console.log('data',pick_id);
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this pick up?You can not view this pick up in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deletePickUp(pick_id).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.pickUpList();
            this._loader.stopLoader('loader');
          },err =>{
            Swal.fire(
              'Not Deleted!',
              'Something wrong. Please try again.',
              'warning'
            )
          })
          this._loader.stopLoader('loader');
      } 
    })    
  }

  openModalWithClass(template: TemplateRef<any>,pickId : any) {  
    this.pickId = pickId;
    this.modalRef = this.modalService.show(  
      template,  
      Object.assign({}, { class: 'gray modal-sm' })  
    );  
  } 
  get f(){
    return this.statusForm.controls
  }
  get h(){
    return this.boyAssignForm.controls
  }

  submitStatus(status : any = '', pickupId : any = ''){
    
    this.submitted=true;
    this._loader.startLoader('loader');
    let mainForm = {};
      
    if(status !== '' && pickupId !== '') {
      this.pickId = pickupId;
      mainForm = {status};
    } else {
      mainForm = this.statusForm.value;
    }
    console.log(mainForm);

    if ((this.statusForm.valid) || (status !== '' && pickupId !== '')) {
      this._api.updateStatus(this.pickId, mainForm).subscribe(
        res=>{
          this.Toast.fire({
            icon: 'success',
            title: 'Status updated successfully'
          })
          if (status === '' && pickupId === '') {
            this.modalRef.hide();
          }
          this.pickUpList();
          this._loader.stopLoader('loader');
        },err=>{}
      )
    } else {
      return;
    } 
  } 
  
  submitAssignBoy(){
    this.submitted=true;
    this._loader.startLoader('loader');
    if ( this.boyAssignForm.valid) {
      this._api.updatePickUp(this.selectedPickup._id, this.boyAssignForm.value).subscribe(
        res=>{
          this.Toast.fire({
            icon: 'success',
            title: 'Boy assigned successfully'
          })
          this.emptyModal();
          this.pickUpList();
          this.submitStatus('Pick Up assigned', this.selectedPickup._id)
          this._loader.stopLoader('loader');
        },err=>{

        })
    } else {
      return;
    }
    this.closeModal();
    console.log(this.boyAssignForm.value);
    
  } 
  
  emptyModal() {
    this.mainForm.reset();
  }
  closeModal() {
    this.closebutton.nativeElement.click();
  }

  searchPickupDateRange(evt : any) {
    this.filter = true;
    console.log(evt.target.value);
    let today = new Date();
    let range = new Date();

    let rangeVal = evt.target.value;
    if (rangeVal === 'today') {
      today.setDate(today.getDate() + 1);
    }
    if (rangeVal === 'week') {
      range.setDate(today.getDate() - 7);
    }
    if (rangeVal === 'month') {
      range.setDate(today.getDate() - 30);
    }
    if (rangeVal === 'year') {
      range = new Date(today.getFullYear(), 0, 1);
    }
    if (rangeVal === 'all') {
      return this.pickUpList();
    }
    console.log({today: getDateFormat(today), range: getDateFormat(range)});
    
    let startDate = getDateFormat(range);
    let endDate = getDateFormat(today);

    this._loader.startLoader('loader');
    this._api.pickupSearchByDateRange(startDate, endDate).subscribe(
      res => {
        console.log(res);
        this.pickUpData = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }
  
  searchPickupDate(evt : any) {
    this.filter = true;
    console.log(evt.target.value);
    let selectedDate = evt.target.value;

    this._loader.startLoader('loader');
    this._api.pickupSearchByDate(selectedDate).subscribe(
      res => {
        console.log(res);
        this.pickUpData = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

  searchPickupByStatus(status : any = 'Cancelled') {
    // this.filter = true;
    this._loader.startLoader('loader');
    this._api.pickupSearchByStatus(status).subscribe(
      res => {
        console.log(res);
        this.pickUpData = res.data;
    
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

  searchCustomer(evt : any) {
    this.filter = true;
    console.log(evt.target.value);
    let keyWord = evt.target.value;
    this._loader.startLoader('loader');
    this._api.pickupCustomerSearch(keyWord).subscribe(
      res => {
        console.log(res);
        this.pickUpData = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }
  
  searchCustomerByMobile(evt : any) {
    console.log(evt.target.value);
    if (evt.target.value.length >= 10) {
      this.filter = true;
      let keyWord = evt.target.value;
      this._loader.startLoader('loader');
      this._api.pickupCustomerSearchMobile(keyWord).subscribe(
        res => {
          console.log(res);
          this.pickUpData = res.data;
          this._loader.stopLoader('loader');
        }, err => {
          this._loader.stopLoader('loader');
        }
      )
    }
  }

  clearFilter() {
    this.filter = false;
    location.reload();
  }

  createOrder(pickupId:any) {
    localStorage.setItem('pickupId',pickupId);
    this._route.navigate(['/admin/order/add/' + pickupId]);
  }
}