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
  public currencyType :any=["INR", "USD"];
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
  constructor(private _api : ApiService, private _router : Router, private activateRouter : ActivatedRoute,private _loader : NgxUiLoaderService, private fbuilder : FormBuilder) { 
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
          logo: res.data[0].logo,
          whatsapp: res.data[0].whatsapp,
          supportTiming: res.data[0].supportTiming,
          tagline: res.data[0].tagline,
          termsAndCondition: res.data[0].termsAndCondition,
          checkoutTerms: res.data[0].checkoutTerms,
          messageSenderId: res.data[0].messageSenderId,
          messageTemplateId: res.data[0].messageTemplateId,
          startingOrderId: res.data[0].startingOrderId,
          timezone: res.data[0].timezone,
          currency: res.data[0].currency,
          cin: res.data[0].cin,
          gst: res.data[0].gst,
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
      logo : new FormControl('Logo url'),
      whatsapp: new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      supportTiming: new FormControl(''),
      tagline: new FormControl(''),
      termsAndCondition: new FormControl(''),
      checkoutTerms: new FormControl(''),
      messageSenderId: new FormControl(''),
      messageTemplateId: new FormControl(''),
      startingOrderId: new FormControl(''),
      timezone: new FormControl('IST'),
      currency: new FormControl('INR'),
      cin: new FormControl(''),
      gst: new FormControl(''),
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
