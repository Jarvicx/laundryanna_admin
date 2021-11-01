import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pick-up-add-edit',
  templateUrl: './pick-up-add-edit.component.html',
  styleUrls: ['./pick-up-add-edit.component.css']
})
export class PickUpAddEditComponent implements OnInit {
  public pickUpForm : FormGroup;
  submitted = false;
  public formType = 'Add';
  public allCustomer : any = [];
  public addressListing :any = [];
  public pickUpId : any ='';
  custmerId : any = '';
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
  constructor( public _api : ApiService, public _loader: NgxUiLoaderService, public fBuilder : FormBuilder, private _router: Router,
               public _activRoute : ActivatedRoute) { 

                this.pickUpId = this._activRoute.snapshot.paramMap.get('pickUpId');
                this.pickUpForm = this.fBuilder.group({
                  customerId: new FormControl(''),
                  addressId : new FormControl(''),
                  pickup_date : new FormControl('', Validators.required),
                  pickup_time : new FormControl('', Validators.required)
                })

                if(this.pickUpId) {
                  this._loader.startLoader('loader');
                  this.formType = 'Edit';
                  this._api.getPickID(this.pickUpId).subscribe(
                    res=>{
                      console.log(res.data);
                      this.pickUpForm.patchValue({
                        customerId: res.data.customerId._id,
                        addressId: res.data.addressId._id,
                        pickup_date : res.data.pickup_date,     
                        pickup_time : res.data.pickup_time
                      })
                      if (res.data.customerId._id) {
                        this.custmerId = res.data.customerId._id;
                        this.addressList(res.data.customerId._id);
                      }
                    this._loader.stopLoader('loader');
                    },err=>{
                      this._loader.stopLoader('loader');
                    })
                }
               }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.customerList();
    }
    else{
      this._api.logoutUser();
    }
  }

  customerList() {
    this._loader.startLoader('loader');
    this._api.getCustomer().subscribe(
      res=>{
        this.allCustomer = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  addressList(e:any){
    console.log('value',this.custmerId);
    if (this.custmerId=='') {
      this.custmerId = e.target.value;
    } 
    
    this._loader.startLoader('loader');
    this._api.getCustomerAddressList(this.custmerId).subscribe(
      res=>{
        console.log(res.data);
        this.addressListing = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }
  
  get f(){
    return this.pickUpForm.controls;
  }

  submitpickUpForm(){
    this.submitted = true;
    if (this.pickUpForm.valid) {
      this._loader.startLoader('loader');
      const mainForm = this.pickUpForm.value;
      if (this.formType === 'Add') {
        this._api.addPickUp(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Pick up added successfully'
            })
            this._router.navigate(['/admin/pick_up/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.Toast.fire({
              icon: 'error',
              title: 'Something went wrong!'
            })
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.pickUpId) {
        this._api.updatePickUp(this.pickUpId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Pick up updated successfully'
            })
            this._router.navigate(['/admin/pick_up/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.Toast.fire({
              icon: 'error',
              title: 'Something went wrong!'
            })
            this._loader.stopLoader('loader');
          }
        )
      }
    }else{
      return;
    }
  }

  cancel(){
    this._router.navigate(['/admin/pick_up/list'])
  }

  updateStatus(addressForm:any){

  }

}
