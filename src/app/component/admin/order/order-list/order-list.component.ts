import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  public orderList : any = [];
  public storeList : any = [];
  public filter : boolean = false;
  public billAmount : number = 0;
  public dueAmount : number = 0;


  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.orderListing();
      this.storeListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  orderListing(){
    this._loader.startLoader('loader');
    this._api.getOrderList().subscribe(
      res => {
        this.orderList = res.data;
        res.data.forEach((element: any) => {
          this.billAmount += element?.totalAmount;
          this.dueAmount += (element?.totalAmount - element?.totalPaid);
        });
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }
  
  storeListing(){
    this._loader.startLoader('loader');
    this._api.getStore().subscribe(
      res => {
        this.storeList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

  // offerStatusChange(offerId : string, status : any){
  //   console.log(offerId);
  //   Swal.fire({
  //     title: 'Update Availability',
  //     text: 'Are you sure you want to change the Availability',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Update',
  //     cancelButtonText: 'Close'
  //   }).then((result) => {
  //     console.log(result);
  //     if (result.value) {
  //       this._loader.startLoader('loader');
  //       const formData = {
  //         status: status
  //       }
  //       this._api.updateOffer(offerId, formData).subscribe(
  //         res => {
  //           console.log('del',res);
  //           Swal.fire(
  //             'Updated!',
  //             'Successfully updated Availability.',
  //             'success'
  //           )
  //           this.orderListing();
  //         },err =>{
  //           Swal.fire(
  //             'Not Deleted!',
  //             'Something wrong. Please try again.',
  //             'warning'
  //           )
  //           this._loader.stopLoader('loader');
  //         }
  //       )
  //     }   
  //   })
  // }

  searchOrder(evt: any, serachField: any) {
    this.filter = true;
    this._loader.startLoader('loader');
    if (serachField === 'id') {
      this._api.searchOrderById(evt.target.value).subscribe(
        res => {
          console.log(res.data);
          if (res.error === false) {
            this.orderList = res.data;
          } else {
            this.orderList = []
          }
        }, err => {
          this.orderList = []
        }
      )
    }
    if (serachField === 'store') {
      this._api.searchOrderByStore(evt.target.value).subscribe(
        res => {
          console.log(res.data);
          if (res.error === false) {
            this.orderList = res.data;
          } else {
            this.orderList = []
          }
        }, err => {
          this.orderList = []
        }
      )
    }
    if (serachField === 'orderStatus') {
      this._api.searchOrderByOrder(evt.target.value).subscribe(
        res => {
          console.log(res.data);
          if (res.error === false) {
            this.orderList = res.data;
          } else {
            this.orderList = []
          }
        }, err => {
          this.orderList = []
        }
      )
    }
    if (serachField === 'paymentStatus') {
      this._api.searchOrderByPayment(evt.target.value).subscribe(
        res => {
          console.log(res.data);
          if (res.error === false) {
            this.orderList = res.data;
          } else {
            this.orderList = []
          }
        }, err => {
          this.orderList = []
        }
      )
    }
    this._loader.stopLoader('loader');
  }

  clearFilter() {
    this.filter = false;
    location.reload();
  }
}
