import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from '../../../../service/api.service';
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  public companyList : any = [];
  changeText : boolean;

  constructor( private _api : ApiService,private _loader : NgxUiLoaderService) {
    this.changeText = false;
   }

  ngOnInit(): void {
    this.companyListing();
  }
  companyListing(){
    this._loader.startLoader('loader');
    this._api.getCompanyList().subscribe(
      res =>{
        console.log(res);
        this.companyList = res.data;
        console.log(this.companyList);
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }
  deleteCompany(cId : any){
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this company?You can not view this company in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteCompany(cId).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.companyListing();
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
