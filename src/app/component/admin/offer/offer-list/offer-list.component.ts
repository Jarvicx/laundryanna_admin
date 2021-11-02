import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

  public offerList : any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.offerListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  offerListing(){
    this._loader.startLoader('loader');
    this._api.getOfferList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.offerList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

  offerStatusChange(offerId : string, status : any){
    console.log(offerId);
    Swal.fire({
      title: 'Update Availability',
      text: 'Are you sure you want to change the Availability',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        const formData = {
          status: status
        }
        this._api.updateOffer(offerId, formData).subscribe(
          res => {
            console.log('del',res);
            Swal.fire(
              'Updated!',
              'Successfully updated Availability.',
              'success'
            )
            this.offerListing();
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
