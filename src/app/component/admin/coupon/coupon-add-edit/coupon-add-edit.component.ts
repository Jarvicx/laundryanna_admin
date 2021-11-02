import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-coupon-add-edit',
  templateUrl: './coupon-add-edit.component.html',
  styleUrls: ['./coupon-add-edit.component.css']
})
export class CouponAddEditComponent implements OnInit {

  public formType : any = 'Add';
  public couponData : any = [];
  public couponId : any = '';
  public today : any = getDateFormat(Date.now());
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
    this.couponId = this._activate.snapshot.paramMap.get('couponId') || '';
    this.couponData.offerType = 'flat'; 
    if(this.couponId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getCouponDetail(this.couponId).subscribe(
        res => {
          console.log(res);
          res.data.startDate = getDateFormat(res.data.startDate);
          res.data.endDate = getDateFormat(res.data.endDate);
          this.couponData = res.data;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  ngOnInit(): void {
  }

  couponFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      if (this.formType === 'Add') {
        this._api.addCoupon(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'coupon added successfully'
            })
            this._router.navigate(['/admin/coupon/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.couponId) {
        this._api.updateCoupon(this.couponId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'coupon updated successfully'
            })
            this._router.navigate(['/admin/coupon/list']);
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
