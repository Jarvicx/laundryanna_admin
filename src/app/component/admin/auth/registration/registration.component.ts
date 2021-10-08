import { Component, OnInit, ɵbypassSanitizationTrustStyle } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public registForm : FormGroup;
  submitted = false;
  hide = false;
  show_eye = true;
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
  constructor(private _api:ApiService, private fbuilder : FormBuilder, private _loader : NgxUiLoaderService, public _router : Router) { 
    this.registForm = this.fbuilder.group({
      name : new FormControl('',Validators.required),
      email : new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      password: ['', [Validators.required , Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$')]],
      confirmPassword: new FormControl('',Validators.required),        
      phone : new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),     
      state : new FormControl('',Validators.required),
      address : new FormControl('',Validators.required),
    })
  }

  ngOnInit(): void {
  }

  get f() {
    return this.registForm.controls;
  }

  showPassword(){
    this.hide = !this.hide;
    this.show_eye = !this.show_eye;
  }

  submitRegisterForm(){
    this.submitted = true;
    if (this.registForm.valid) {
      this._loader.startLoader('loader');
      this.registForm.value.admin_type='1';
      this.registForm.value.status='true';
      this._api.adminRegisterApi(this.registForm.value).subscribe(
        res=>{
          console.log(res);
          
          this.Toast.fire({
            icon: 'success',
            title: 'Successfully Registered.'
          })
          this._loader.stopLoader('loader');
          // this._r
        },err =>{
          this.Toast.fire({
            icon: 'warning',
            title: 'Something wrong. Please try again.'
          })
          this._loader.stopLoader('loader');
        }
      )
    } else {
      return;
    }

  }

}
