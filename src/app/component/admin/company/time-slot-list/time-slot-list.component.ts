import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-time-slot-list',
  templateUrl: './time-slot-list.component.html',
  styleUrls: ['./time-slot-list.component.css']
})
export class TimeSlotListComponent implements OnInit {
  public timeData : any = [];
  public companyId  : any ='';

  constructor( private _api: ApiService, private _loader : NgxUiLoaderService, private activatedRoute : ActivatedRoute,
               private _router : Router) { 
    this.companyId = this.activatedRoute.snapshot.paramMap.get('companyId')
  
  }

  ngOnInit(): void {
    if(localStorage.getItem('accessToken')) {
      this.timeList();
    } else {
      this._api.logoutUser();
    }
  }

  timeList(){
    this._loader.startLoader('loader');
    this._api.getTimeSlotByCompany(this.companyId).subscribe(
      res=>{
        console.log(res);
        this.timeData = res.data;      
        this._loader.stopLoader('loader');  
      },err=>{
        this._loader.stopLoader('loader');
      }
    )
  }

  addTime(){
    this._router.navigate(["/admin/time-slot/add/" + this.companyId]) 
  }

  deleteTime(t_id : any){
    Swal.fire({
      title : 'Delete Confirmation',
      text : 'Are you sure you want to permanenlty delete this time-slot? You can not view this time-slot in your list.',
      icon : 'warning',
      showConfirmButton : true,
      cancelButtonText : 'Cancel',
      confirmButtonText : 'Delete Permanently'
    }).then((result)=>{
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteTimeSlot(t_id).subscribe(
          res=>{
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.timeList();
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

