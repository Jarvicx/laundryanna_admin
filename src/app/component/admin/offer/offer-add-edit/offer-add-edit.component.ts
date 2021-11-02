import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-offer-add-edit',
  templateUrl: './offer-add-edit.component.html',
  styleUrls: ['./offer-add-edit.component.css']
})
export class OfferAddEditComponent implements OnInit {
  public formType : any = 'Add';
  public offerData : any = [];
  public offerId : any = '';
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
  public errorMessage : any = ''

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService, private _router : Router, private _activate : ActivatedRoute ) { 
    this.offerId = this._activate.snapshot.paramMap.get('offerId') || '';
    if(this.offerId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getOfferDetail(this.offerId).subscribe(
        res => {
          console.log(res);
          this.offerData = res.data;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  ngOnInit(): void {
  }

  offerFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      if (this.formType === 'Add') {
        this._api.addOffer(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Offer added successfully'
            })
            this._router.navigate(['/admin/offer/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.offerId) {
        this._api.updateOffer(this.offerId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Offer updated successfully'
            })
            this._router.navigate(['/admin/offer/list']);
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
