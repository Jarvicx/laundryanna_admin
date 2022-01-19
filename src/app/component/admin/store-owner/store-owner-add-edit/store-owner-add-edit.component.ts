import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-store-owner-add-edit',
  templateUrl: './store-owner-add-edit.component.html',
  styleUrls: ['./store-owner-add-edit.component.css']
})
export class StoreOwnerAddEditComponent implements OnInit {

  public formType : any = 'Add';
  public storeOwnerData : any = [];
  public storeOwnerId : any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });
  public errorMessage : any = ''

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService, private _router : Router, private _activate : ActivatedRoute ) { 
    this.storeOwnerId = this._activate.snapshot.paramMap.get('storeOwnerId') || '';
    if(this.storeOwnerId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getStoreOwnerById(this.storeOwnerId).subscribe(
        res => {
          console.log(res);
          this.storeOwnerData = res.data;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  ngOnInit(): void {
  }

  storeOwnerFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      if (this.formType === 'Add') {
        this._api.addStoreOwners(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'StoreOwner added successfully'
            })
            this._router.navigate(['/admin/store-owner/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.storeOwnerId) {
        this._api.updateStoreOwner(this.storeOwnerId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'StoreOwner updated successfully'
            })
            this._router.navigate(['/admin/store-owner/list']);
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
