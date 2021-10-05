import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.css']
})
export class SubCategoryListComponent implements OnInit {
  public subCategoryList :any=[];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService){}

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.subCategoryListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  subCategoryListing(){
    this._loader.startLoader('loader');
    this._api.getSubCategory().subscribe(
      res=>{
        console.log('**res**',res.data);
        this.subCategoryList = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deletesubCategory(subCategoryId : any){
    Swal.fire({
      title : 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this sub-category? You can not view this sub-category in your list',
      icon: 'warning',
      showCancelButton : true,
      confirmButtonText : 'Delete permanently',
      cancelButtonText : 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteSubCategory(subCategoryId).subscribe(
          res => {
            console.log('del',res);
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.subCategoryListing();
          },err =>{
            Swal.fire(
              'Not Deleted!',
              'Something wrong. Please try again.',
              'warning'
            )
            this._loader.stopLoader('loader');
        })
      }
    })
  }
}
