import { Component, OnInit, TemplateRef } from '@angular/core';  
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-pick-up-list',
  templateUrl: './pick-up-list.component.html',
  styleUrls: ['./pick-up-list.component.css']
})
export class PickUpListComponent implements OnInit {
  modalRef: any = BsModalRef;
  public pickUpData : any = []; 
  public filter : boolean = false; 
  statusForm : FormGroup;
  allStatus=["New Order", "Pick Up assigned", "Order picked", "Delivered", "Cancelled"];
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

  constructor(private _api : ApiService, private _loader : NgxUiLoaderService, private modalService: BsModalService, private fbuilder : FormBuilder) { 
    this.statusForm= this.fbuilder.group({
      status : new FormControl('',Validators.required)
    })
  }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.pickUpList();
    } else {
      this._api.logoutUser();
    }
  }
  pickUpList(){
    this._loader.startLoader('loader');
    this._api.getPickUpList().subscribe(
      res=>{
        console.log(res);       
        this.pickUpData = res.data;
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

  submitStatus(){
    this.submitted=true;
    this._loader.startLoader('loader');
    if ( this.statusForm.valid) {
      this._api.updateStatus(this.pickId,this.statusForm.value).subscribe(
        res=>{
          this.Toast.fire({
            icon: 'success',
            title: 'Status updated successfully'
          })
          this.modalRef.hide();
          this.pickUpList();
          this._loader.stopLoader('loader');
        },err=>{

        })
    } else {
      return;
    } 
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
    this.filter = true;
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

  clearFilter() {
    console.log(111);
    
    this.filter = false;
    location.reload();
  }
}