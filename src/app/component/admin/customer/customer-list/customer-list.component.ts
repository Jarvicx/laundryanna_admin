import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';
import { getDateFormat } from "src/app/service/globalFunction";
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  public allCustomer : any= [];
  constructor( private _api : ApiService, private _loader: NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.customerList();
    } else {
      this._api.logoutUser();
    }
  }

  customerList() {
    this._loader.startLoader('loader');
    this._api.getCustomer().subscribe(
      res=>{
        
        this.allCustomer = res.data;
        console.log(this.allCustomer.length);
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteCustomer(customerId:any){
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this customer?You can not view this customer in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteCustomer(customerId).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.customerList();
            this._loader.stopLoader('loader');
          },err =>{
            Swal.fire(
              'Not Deleted!',
              'Something wrong. Please try again.',
              'warning'
            )
          })
          this._loader.stopLoader('loader');
      } 
    })
  }

  searchCustomer(evt : any) {
    console.log(evt.target.value);
    let keyWord = evt.target.value;
    this._loader.startLoader('loader');
    this._api.customerSearch(keyWord).subscribe(
      res => {
        console.log(res);
        this.allCustomer = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

  searchCustomerDateRange(evt : any) {
    console.log(evt.target.value);
    let today = new Date();
    let range = new Date();

    let rangeVal = evt.target.value;
    if (rangeVal === 'today') {
      today.setDate(today.getDate() + 1);
    }
    if (rangeVal === 'week') {
      range.setDate(today.getDate() - 7);
    }
    if (rangeVal === 'month') {
      range = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    if (rangeVal === 'year') {
      range = new Date(today.getFullYear(), 0, 1);
    }
    if (rangeVal === 'all') {
      return this.customerList();
    }
    console.log({today: getDateFormat(today), range: getDateFormat(range)});
    
    let startDate = getDateFormat(range);
    let endDate = getDateFormat(today);

    this._loader.startLoader('loader');
    this._api.customerSearchByDate(startDate, endDate).subscribe(
      res => {
        console.log(res);
        this.allCustomer = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }
}

