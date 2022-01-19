import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-store-owner-list',
  templateUrl: './store-owner-list.component.html',
  styleUrls: ['./store-owner-list.component.css']
})
export class StoreOwnerListComponent implements OnInit {

  public storeOwnerList : any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.storeOwnerListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  storeOwnerListing(){
    this._loader.startLoader('loader');
    this._api.getStoreOwners().subscribe(
      res => {
        console.log(res);
        this.storeOwnerList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

}
