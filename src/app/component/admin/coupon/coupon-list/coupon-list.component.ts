import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css']
})
export class CouponListComponent implements OnInit {

  public couponList : any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.couponListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  couponListing(){
    this._loader.startLoader('loader');
    this._api.getCouponList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.couponList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteCoupon(couponId : string){
    console.log(couponId);
    Swal.fire({
      title: 'Delete Coupon',
      text: 'Are you sure you want to delete the coupon permanantly?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteCoupon(couponId).subscribe(
          res => {
            console.log('del',res);
            Swal.fire(
              'Deleted!',
              'Successfully deleted coupon.',
              'success'
            )
            this.couponListing();
          },err =>{
            Swal.fire(
              'Not Deleted!',
              'Something wrong. Please try again.',
              'warning'
            )
            this._loader.stopLoader('loader');
          }
        )
      }   
    })
  }
}
