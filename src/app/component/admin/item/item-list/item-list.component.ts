import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  public itemList : any=[];
  constructor(private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.itemListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  itemListing(){
    this._loader.startLoader('loader');
    this._api.getItemList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.itemList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }
  deleteItems(itemid:any){
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this item? You can not view this item in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteItem(itemid).subscribe(
          res => {
            console.log('del',res);
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.itemListing();
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