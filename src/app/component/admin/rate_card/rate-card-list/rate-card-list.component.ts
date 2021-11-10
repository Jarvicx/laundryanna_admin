import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-rate-card-list',
  templateUrl: './rate-card-list.component.html',
  styleUrls: ['./rate-card-list.component.css']
})
export class RateCardListComponent implements OnInit {

  public rateCardList : any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.rateCardListng();
    }
    else{
      this._api.logoutUser();
    }
  }

  rateCardListng(){
    this._loader.startLoader('loader');
    this._api.getRateCardList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.rateCardList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteRateCard(rateCardId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This rate card will not recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loader.startLoader('loader');
        this._api.deleteRateCard(rateCardId).subscribe(
          res => {
            console.log(res);
            this.rateCardListng();
            this._loader.stopLoader('loader');
          }, err => {}
        )
        Swal.fire(
          'Deleted!',
          'Rate card has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Rate card is safe :)',
          'error'
        )
      }
    })
    // this._api.deleteRateCard(rateCardId).subscribe(
    //   res => {

    //   }, err => {}
    // )
  }

}
