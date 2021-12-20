import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css']
})
export class CustomerAddressComponent implements OnInit {
  public addressForm : FormGroup;
  submitted = false;
  formType = 'Add';
  customerId :any = '';
  addressId : any = '';
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
  public lat: number = 0;
  public lon: number = 0;
  public addressLine1 : any = "";
  public options: any = {
    componentRestrictions:{
      country:["IN"]
    }
  }
  
  constructor( private _api : ApiService, public _loader: NgxUiLoaderService, public frmBuilder : FormBuilder, 
    private activatedR : ActivatedRoute, private _router: Router) { 
      this.customerId = this.activatedR.snapshot.paramMap.get('customerId');
      this.addressId  = this.activatedR.snapshot.paramMap.get('addressId');
      if (this.addressId) {
        this.formType = 'edit';
        this._loader.startLoader('loader');
        this._api.getCustomerAddressById(this.addressId).subscribe(res=>{
          this.addressForm.patchValue({
            addressLine2: res.data?.addressLine2,
            landmark: res.data?.landmark,
            city: res.data?.city,
            pin: res.data?.pin,
            type: res.data?.type,
          })
          this.addressLine1 = res.data?.addressLine1
          this.lat = res.data?.lat
          this.lon = res.data?.lon
          this._loader.stopLoader('loader');
        },err=>{
          this._loader.stopLoader('loader');
        })
      }
    this.addressForm = this.frmBuilder.group({
      addressLine2: new FormControl('', Validators.required),
	    landmark: new FormControl('', Validators.required),
	    city: new FormControl('', Validators.required),
	    pin: new FormControl('', Validators.required),
	    type: new FormControl('', Validators.required),
    })
  }

  get f(){
    return this.addressForm.controls;
  }
  ngOnInit(): void {
  }

  submitAddress(){
    this.submitted = true;
    if (this.addressForm.valid) {
      this._loader.startLoader('loader');
      this.addressForm.value.customerId = this.customerId;
      this.addressForm.value.addressLine1 = this.addressLine1;
      this.addressForm.value.lat = this.lat;
      this.addressForm.value.lon = this.lon;
      if (this.formType === 'Add') {
        this._api.createAddress(this.addressForm.value).subscribe(
          res=>{
            this.Toast.fire({
              icon: 'success',
              title: 'Address added successfully'
            })
            this._router.navigate(['/admin/customer-address/list/'+this.customerId]);
            this._loader.stopLoader('loader');
          },err=>{
            this.Toast.fire({
              icon: 'error',
              title: 'Something Wrong. Please try again.'
            })
            this._loader.stopLoader('loader');
          }
        )
      }else{
        this._api.updateAddress(this.addressId, this.addressForm.value).subscribe(
          res=>{
            this.Toast.fire({
              icon: 'success',
              title: 'Address updated successfully.'
            })
            this._router.navigate(['/admin/customer-address/list/'+this.customerId]);
            this._loader.stopLoader('loader');
          },err=>{
            this.Toast.fire({
              icon: 'error',
              title: 'Something Wrong. Please try again.'
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
    this._router.navigate(['/admin/customer-address/list/'+this.customerId]);
  }

  public AddressChange(address: any) {
    //setting address from API to local variable
    console.log("Google location:",address);
    this.addressLine1 = address.formatted_address;
    this.lat = address.geometry.location.lat();
    this.lon = address.geometry.location.lng();
  }

}
