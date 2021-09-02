import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-city-add-edit',
  templateUrl: './city-add-edit.component.html',
  styleUrls: ['./city-add-edit.component.css']
})
export class CityAddEditComponent implements OnInit {

  public formType : any = 'Add';
  public cityData : any = [];
  public cityId : any = '';
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
    this.cityId = this._activate.snapshot.paramMap.get('cityId') || '';
    if(this.cityId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getCityById(this.cityId).subscribe(
        res => {
          console.log(res);
          this.cityData = res.data;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  ngOnInit(): void {
  }

  submitCityForm(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      if (this.formType === 'Add') {
        this._api.addCity(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'City added successfully'
            })
            this._router.navigate(['/admin/city/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.cityId) {
        this._api.updateCity(this.cityId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'City updated successfully'
            })
            this._router.navigate(['/admin/city/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
      this._loader.stopLoader('loader');
    }
  }

}
