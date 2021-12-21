import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-service-boy-calendar',
  templateUrl: './service-boy-calendar.component.html',
  styleUrls: ['./service-boy-calendar.component.css']
})
export class ServiceBoyCalendarComponent implements OnInit {

  public serviceBoyData : any = [];
  public timeSlot: any = [];
  public daysOff: any = [];
  currentDate = new Date();
  public minDate :any = getDateFormat(this.currentDate.setDate(this.currentDate.getDate() + 1));
  public weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  public serviceBoyId : any = '';
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
  public errorMessage : any = ''

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService, private _router : Router, private _activate : ActivatedRoute ) { 
    this.serviceBoyId = this._activate.snapshot.paramMap.get('serviceBoyId') || '';
    if(this.serviceBoyId) {
      this._loader.startLoader('loader');
      this._api.getServiceBoyById(this.serviceBoyId).subscribe(
        res => {
          console.log(res);
          this.timeSlot = res.data?.timeSlot;
          this.daysOff = res.data?.daysOff;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  ngOnInit(): void {
  }

  timeslotFormSubmit(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      let dayCheck = this.timeSlot.find((e:any) => e.day.toString() === formData.value.day);
      if (!dayCheck || dayCheck === undefined) {
        this.timeSlot.push({day: formData.value.day, start: formData.value.start, end: formData.value.end});
        console.log(this.timeSlot);
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Day already added!'
        })
      }

    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Please fill out all the fields'
      })
    }
  }
  
  daysOffFormSubmit(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      let offCheck = this.daysOff.find((e:any) => getDateFormat(e.offDate) === formData.value.offDate);
      if (!offCheck || offCheck === undefined) {
        this.daysOff.push({offDate: formData.value.offDate, offType: formData.value.offType, note: formData.value.note});
        console.log(this.daysOff);
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Leave already added!'
        })
      }

    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Please fill out all the fields'
      })
    }
  }

  removeTimeSlot(index: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.timeSlot.splice(index, 1);
        this.Toast.fire({
          icon: 'success',
          title: 'Deleted'
        })
      }
    })
  }
  
  removeDaysoff(index: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.daysOff.splice(index, 1);
        this.Toast.fire({
          icon: 'success',
          title: 'Deleted'
        })
      }
    })
  }

  serviceBoyFormSubmit() {
    this._loader.startLoader('loader');
    this.timeSlot.sort((a:any, b:any) => parseInt(a.day)-parseInt(b.day));
    if (this.serviceBoyId) {
      this._api.updateServiceBoy(this.serviceBoyId, {timeSlot: this.timeSlot, daysOff: this.daysOff}).subscribe(
        res => {
          this.Toast.fire({
            icon: 'success',
            title: 'Service boy updated successfully'
          })
          this._router.navigate(['/admin/service-boy/list']);
          this._loader.stopLoader('loader');

        }, err => {
          this.errorMessage = 'Something went wrong!';
          this._loader.stopLoader('loader');
        }
      )
    }
  }

}
