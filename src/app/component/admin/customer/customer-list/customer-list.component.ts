import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

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
        console.log(res);
        
        this.allCustomer = res.data;
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
}

