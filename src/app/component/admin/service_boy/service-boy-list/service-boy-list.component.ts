import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-service-boy-list',
  templateUrl: './service-boy-list.component.html',
  styleUrls: ['./service-boy-list.component.css']
})
export class ServiceBoyListComponent implements OnInit {
  public service_boyList :any= [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this.service_boy_List();
    } else {
      this._api.logoutUser();
    }
  }

  service_boy_List(){
    this._loader.startLoader('loader');
    this._api.getServiceBoyList().subscribe(
      res=>{
        console.log(res);       
        this.service_boyList = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteData(s_id:any){
    console.log('data',s_id);
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this service boy?You can not view this service boy in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteServiceBoy(s_id).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.service_boy_List();
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
