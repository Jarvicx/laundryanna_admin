import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css']
})
export class CompanySettingsComponent implements OnInit {
  public settingsData : any ={};
  public adminDetail: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public passwordErrorMessage: any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });
  public confirmPassword: any = '';

  constructor(private _api : ApiService, private _loader : NgxUiLoaderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this._loader.startLoader('loader');
      this._api.getSettings().subscribe(
        res=>{
          this.settingsData = res.data[0];
          console.log(this.settingsData);
          this._loader.stopLoader('loader');
        },err =>{
          this._loader.stopLoader('loader');
        }
      )
    } else {
      this._api.logoutUser();
    }
  }


  changePassword(formData : any) {
    this.passwordErrorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.confirmPassword === formData.value.password) {
        if (formData.value.password === formData.value.old_password) {
          this.passwordErrorMessage = 'Old and new passwords cannot be same.';
        } else {
          this.passwordErrorMessage = '';
          this._loader.startLoader('loader');
          const mainForm = formData.value;
          this._api.adminChangePassword(this.adminDetail._id, mainForm).subscribe(
            res => {
              this._loader.stopLoader('loader');
              this.Toast.fire({
                icon: 'success',
                title: 'Password changed successfully!'
              })
            },
            err => {
              this.passwordErrorMessage = err.message;
              this._loader.stopLoader('loader');
            }
          );
        }
      }else {
        this.passwordErrorMessage = 'Password confirmation not matched';
      }
    } else {
      this.passwordErrorMessage = 'New and Current Password are required';
    }
  }

  
}
