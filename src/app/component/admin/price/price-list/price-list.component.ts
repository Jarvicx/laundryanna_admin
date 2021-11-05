import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  public priceList : any = [];
  public itemList : any = [];
  public categoryList : any = [];
  public selectedItem: any = '';
  public selectedCategory: any = '';
  public filtered: boolean = false;

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.priceListing();
      this.itemListing();
      this.categoryListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  priceListing(){
    this._loader.startLoader('loader');
    this._api.getPriceList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.priceList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
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

  categoryListing(){
    this._loader.startLoader('loader');
    this._api.getCategoryList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.categoryList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

  deletePrice(PriceId : string){
    console.log(PriceId);
    Swal.fire({
      title: 'Delete Price',
      text: 'Are you sure you want to delete the Price permanantly?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deletePrice(PriceId).subscribe(
          res => {
            console.log('del',res);
            Swal.fire(
              'Deleted!',
              'Successfully deleted Price.',
              'success'
            )
            this.priceListing();
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

  serachPriceByItemCategory() {
    this.filtered = true;
    this._api.searchPrice(this.selectedItem, this.selectedCategory).subscribe(
      res => {
        console.log(res);
        this.priceList = res.data;
      },
      err => {}
    )
  }

  clearFilter() {
    this.filtered = false;
    this.priceListing();
    this.selectedItem = '';
    this.selectedCategory = '';
  }

}
