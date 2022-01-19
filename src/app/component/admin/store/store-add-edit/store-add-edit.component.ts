import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-store-add-edit',
  templateUrl: './store-add-edit.component.html',
  styleUrls: ['./store-add-edit.component.css']
})
export class StoreAddEditComponent implements OnInit {

  public formType: any = 'Add';
  public storeId: any = '';
  public storeData: any = {};
  public companyData: any = [];
  public rateCardData: any = [];
  public storeOwnerData: any = [];
  // public lat: number = 0;
  // public lon: number = 0;
  public location : any = {};
  public options: any = {
    componentRestrictions:{
      country:["IN"]
    }
  }
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });
  public errorMessage : any = ''

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService, private _router : Router, private _activate : ActivatedRoute ) { 
    this.storeId = this._activate.snapshot.paramMap.get('storeId') || '';
    if(this.storeId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getStoreById(this.storeId).subscribe(
        res => {
          console.log("store detail", res);
          this.storeData = res.data;
          this.storeData.rateCard = res.data?.rateCard?._id;
          this.storeData.storeOwner = res.data?.storeOwner?._id;
          this.location = {
            location: res.data.location,
            lat: res.data.lat,
            lon: res.data.lon,
            pin: res.data.pin,
            country: res.data.country,
            state: res.data.state,
          };
          
          this._loader.stopLoader('loader')
        }
      )
    }
    
    this._api.getRateCardList().subscribe(
      res => {
        this.rateCardData = res.data;
        if(!this.storeId) {
          this.storeData.rateCard = res?.data[0]?._id || '';
        }
        // console.log("rateCard data: ",this.storeData.rateCard);
      }
    )
    
    this._api.getStoreOwners().subscribe(
      res => {
        this.storeOwnerData = res.data;
        if(!this.storeId) {
          this.storeData.storeOwner = res?.data[0]?._id || '';
        }
      }
    )
  }

  ngOnInit(): void {
  }
  
  public AddressChange(address: any) {
    //setting address from API to local variable
    this.location = {
      location: address.formatted_address,
      lat: address.geometry.location.lat(),
      lon: address.geometry.location.lng()
    };
    const adressLength  = address.address_components.length;
    this.location.pin = +address.address_components[adressLength-1].long_name;
    this.location.country = address.address_components[adressLength-2].long_name;
    this.location.state = address.address_components[adressLength-3].long_name;
    console.log("Google location:",address);
    
  }

  storeFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      mainForm.location = this.location.location;
      mainForm.addressLine2 = this.location.location;
      mainForm.lat = this.location.lat;
      mainForm.lon = this.location.lon;
      mainForm.country = this.location.country;
      mainForm.state = this.location.state;
      mainForm.pin = this.location.pin;
      console.log("Store form", mainForm);
      
      if (this.formType === 'Add') {
        this._api.addStore(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Store added successfully'
            })
            this._router.navigate(['/admin/store/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.storeId) {
        this._api.updateStore(this.storeId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Store updated successfully'
            })
            this._router.navigate(['/admin/store/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
      this._loader.stopLoader('loader');
    }
  }

}
