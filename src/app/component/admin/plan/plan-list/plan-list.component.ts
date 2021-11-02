import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {

  public planList : any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.planListing();
    }
    else{
      this._api.logoutUser();
    }
  }

  planListing(){
    this._loader.startLoader('loader');
    this._api.getPlanList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.planList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }

  deletePlan(planId : string){
    console.log(planId);
    Swal.fire({
      title: 'Delete Plan',
      text: 'Are you sure you want to delete the Plan permanantly?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deletePlan(planId).subscribe(
          res => {
            console.log('del',res);
            Swal.fire(
              'Deleted!',
              'Successfully deleted Plan.',
              'success'
            )
            this.planListing();
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
