import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting-update',
  templateUrl: './setting-update.component.html',
  styleUrls: ['./setting-update.component.css']
})
export class SettingUpdateComponent implements OnInit {
  settingsId : any = '';
  public settingsData :any=[];
  public settingsForm : FormGroup;
  public submitted =false;
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
  constructor(private _api : ApiService, private _router : Router, private activateRouter : ActivatedRoute,private _loader : NgxUiLoaderService,
              private fbuilder : FormBuilder) { 
    this.settingsId = this.activateRouter.snapshot.paramMap.get('settingsId');
    this._loader.startLoader('loader');
    this._api.getSettings().subscribe(
      res=>{
        console.log(res.data);
        console.log(res.data[0].name);
        this.settingsForm.patchValue({
          name : res.data[0].name,
          email: res.data[0].email,
          phone: res.data[0].phone,
          addrees: res.data[0].addrees,
          desc: res.data[0].desc,
          logo: res.data[0].logo
        })
        this._loader.stopLoader('loader');
      },err =>{
        this._loader.stopLoader('loader');
      }
    )

    this.settingsForm = this.fbuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      phone : new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),     
      addrees :  new FormControl('', Validators.required),
      desc : new FormControl('', Validators.required),
      logo : new FormControl('https://media.istockphoto.com/vectors/washing-machine-with-a-wash-basin-and-cleaning-stuff-vector-id1141658592?k=20&m=1141658592&s=612x612&w=0&h=FpNfdvX28sfE17zvGl8dGuhyYJu31X3UTCusmc6Ed2o=')
    })
  };
   

  ngOnInit(): void {
   
  }
  get f(){
    return this.settingsForm.controls;
  }
  submitSettingsForm(){
    this.submitted = true;
    if (this.settingsForm.valid){
      this._loader.startLoader('loader');
      this._api.updateSettings(this.settingsForm.value, this.settingsId).subscribe(
        res=>{
          this.Toast.fire({
            icon: 'success',
            title: 'Settings updated successfully'
          })
          this._router.navigate(['/admin/master-settings']);
          this._loader.stopLoader('loader');

        }, err => {
          this.Toast.fire({
            icon: 'error',
            title: 'Something went wrong!'
          })
          this._loader.stopLoader('loader');
        }
      )
    }
  }
  cancel(){
    this._router.navigate(['/admin/master-settings'])
  }

}
