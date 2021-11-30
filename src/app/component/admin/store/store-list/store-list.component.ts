import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {

  public storeList :any= [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.storeListing();
    } else {
      this._api.logoutUser();
    }
  }

  storeListing(){
    this._loader.startLoader('loader');
    this._api.getStore().subscribe(
      res=>{
        console.log(res);       
        this.storeList = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteData(storeId:any){
    console.log('data',storeId);
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this store?You can not view this store in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteStore(storeId).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.storeListing();
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
