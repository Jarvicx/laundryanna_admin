import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-time-slot-add-edit',
  templateUrl: './time-slot-add-edit.component.html',
  styleUrls: ['./time-slot-add-edit.component.css']
})
export class TimeSlotAddEditComponent implements OnInit {
  public timeslotForm : FormGroup;
  public companyId : any = '';
  public timeslotID : any ='';
  public submitted : boolean =false;
  public formType = 'Add'
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  constructor(private _api : ApiService, private _loader : NgxUiLoaderService, private _router : Router, private activatedRoute : ActivatedRoute,
              private fb : FormBuilder ) { 
                this.companyId = this.activatedRoute.snapshot.paramMap.get('companyId')
                this.timeslotID = this.activatedRoute.snapshot.paramMap.get('timeId')
                if (this.timeslotID) {
                  this._loader.startLoader('loader');
                  this.formType = 'Edit';
                    this._api.getTimeIDSlotByCompany(this.timeslotID).subscribe(
                      res=>{
                        console.log('data',res.data);
                        this.timeslotForm.patchValue({
                          startTime : res.data.startTime,
                          endTime : res.data.endTime
                        })
                        this._loader.stopLoader('loader');
                      },err=>{
                        this._loader.stopLoader('loader');
                  })
                }
                this.timeslotForm = this.fb.group({
                  startTime : new FormControl('', Validators.required),
                  endTime : new FormControl('', Validators.required)
                })
              }

  ngOnInit(): void {
  }
  get f(){
    return this.timeslotForm.controls;
  }

  submitTimeSlot(){
    this.submitted = true;
    if (this.timeslotForm.valid) {
      this._loader.startLoader('loader');
      if (this.formType === 'Add') {
        console.log('value',this.timeslotForm.value);
        this.timeslotForm.value.companyId = this.companyId;
        this._api.createtime(this.timeslotForm.value).subscribe(
          res=>{
            console.log(res);
            this.Toast.fire({
              icon:'success',
              title : 'Time addedd successfully.'
            })
            this._router.navigate(['/admin/time-slot/list/' +this.companyId])
            this._loader.stopLoader('loader')
          },err=>{
            this.Toast.fire({
              icon:'error',
              title : 'Something went wrong! Please try again.'              
            })
            this._loader.stopLoader('loader')
          })
      } else {
        this.timeslotForm.value.companyId = this.companyId;
        this._api.updatetime(this.timeslotForm.value, this.timeslotID).subscribe(
          res=>{
            console.log(res);
            this.Toast.fire({
              icon:'success',
              title : 'Time updated successfully.'
            })
            this._router.navigate(['/admin/time-slot/list/' +this.companyId])
            this._loader.stopLoader('loader')
          },err=>{
            this.Toast.fire({
              icon:'error',
              title : 'Something went wrong! Please try again.'              
            })
            this._loader.stopLoader('loader')
          })
      }
    } else {
      
    }
  }

  

  cancel(){
    this._router.navigate(['/admin/time-slot/list/' +this.companyId])
  }

}
