import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-address-list',
  templateUrl: './customer-address-list.component.html',
  styleUrls: ['./customer-address-list.component.css']
})
export class CustomerAddressListComponent implements OnInit {
  customerId : any = '';
  public addressListing :any = [];
  constructor(private _api : ApiService, private _loader : NgxUiLoaderService, private activatedRoute : ActivatedRoute,
    private _router : Router){
    this.customerId = this.activatedRoute.snapshot.paramMap.get('customerId')
   }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.addressList();
    }
    else{
      this._api.logoutUser();
    }
  }

  addressList(){
    this._loader.startLoader('loader');
    this._api.getCustomerAddressList(this.customerId).subscribe(
      res=>{
        console.log(res.data);
        this.addressListing = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }
  deleteAddress(addressId :any){
    Swal.fire({
      icon:'warning',
      title : 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this address?You can not view this address in your list',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete Permanently'
    }).then((result)=>{
      if (result) {
        this._loader.startLoader('loader');
        this._api.deleteAddress(addressId).subscribe(
          res => {
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.addressList();
            this._loader.stopLoader('loader');
          },err=>{
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
  add(){
    this._router.navigate(['/admin/customer-address/add/'+this.customerId]);
  }
}
