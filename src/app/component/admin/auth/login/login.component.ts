import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
  }

  submitForm(formData : any) {
    console.log('formData',formData);
    console.log('formData.controls',formData.controls);
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      this._api.adminLoginApi(mainForm).subscribe(
        res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Logged in successful'
            })
            this._api.storeUserLocally(res);
            this._loader.stopLoader('loader');  
          }, err => {
            if (err.error.error === true && err.error.message === 'wrong password!') {
              this.errorMessage = 'Passwors is wrong.';
              this._loader.stopLoader('loader');
            } else if (err.error.error === true && err.error.message === 'wrong email!') {
              this.errorMessage = 'Your email-id is wrong. Please check.';
              this._loader.stopLoader('loader');
            }else {
              this.errorMessage = 'Something went wrong!';
              this._loader.stopLoader('loader');
            }
          }
        )
      
    } else {
      this.errorMessage = 'Please fill out all the details';
      this._loader.stopLoader('loader');
    }
  }



}
