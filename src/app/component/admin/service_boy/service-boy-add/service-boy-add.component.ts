import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-boy-add',
  templateUrl: './service-boy-add.component.html',
  styleUrls: ['./service-boy-add.component.css']
})
export class ServiceBoyAddComponent implements OnInit {
  public serviceBoyform : FormGroup;
  public formType = 'Add';
  submitted = false;
  isAddMode : boolean;
  hide = true;
  show_eye = false;
  serviceBoyId : any ='';
  public serviceBoyType : any = ['Factory Boy', 'Delivery Boy']
  public storelist : any = [];
  public selectedStore : any = '';

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
  constructor( private _api: ApiService, private _loader : NgxUiLoaderService, private formBuilder : FormBuilder, public _activRoute : ActivatedRoute, public _router : Router){

    this.serviceBoyId = this._activRoute.snapshot.paramMap.get('serviceBoyId');
    this.isAddMode = !this.serviceBoyId;
    console.log('**this.isAddMode value**',this.isAddMode);

    this._api.getStore().subscribe(
      res => {
        this.storelist = res.data.map( (e: any) => ({_id: e._id, name: e.name}) );
        console.log('Store list', this.storelist);
        this.selectedStore = this.storelist[0]._id;
      }, err => {}
    )
    const passwordValidators = [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$')];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
      
    }
    if(this.serviceBoyId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getServiceBoyById(this.serviceBoyId).subscribe(
        res=>{
          console.log(res.data);
          this.serviceBoyform.patchValue({
            name: res.data.name,
            email: res.data.email,
            phone : res.data.phone,     
            gender : res.data.gender,
            age : res.data.age,
            boy_type : res.data.boy_type,
            image : res.data.image
          })
          this.selectedStore = res.data?.store?._id;
        this._loader.stopLoader('loader');
        },err=>{
          this._loader.stopLoader('loader');
        })
    }


    this.serviceBoyform = this.formBuilder.group({
      store: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      password:  ['', [this.isAddMode ? Validators.required : Validators.nullValidator, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$')]],
      conFirmpassword: new FormControl(['',this.isAddMode ? Validators.required : Validators.nullValidator]),    
      phone : new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),     
      gender :  new FormControl('', Validators.required),
      age :  new FormControl('', [Validators.required,Validators.pattern("^[0-9]{2}$")]),
      boy_type :  new FormControl('Factory Boy',Validators.required),
      image : new FormControl('https://media.istockphoto.com/vectors/washing-machine-with-a-wash-basin-and-cleaning-stuff-vector-id1141658592?k=20&m=1141658592&s=612x612&w=0&h=FpNfdvX28sfE17zvGl8dGuhyYJu31X3UTCusmc6Ed2o=')
    },{ 
      validator: this.isAddMode ? this.checkPasswords('password','conFirmpassword') : Validators.nullValidator
    })
  }

  ngOnInit(): void {
  }

  get f(){
    return this.serviceBoyform.controls;
  }

  checkPasswords(controlName : any, matchingControlName : any){
    return(group:FormGroup)=>{
      const pass = group.controls[controlName];
      const confirmPass = group.controls[matchingControlName];
      if (confirmPass.errors && !confirmPass.errors.mustMatch) {
        return;
      }
      // set error on matchingControl if validation fails
      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ confirmedValidator: true });   
      } else {
        confirmPass.setErrors(null);
          
      }
    }
  }

  submitServiceBoy(){
    console.log('mainForm',this.serviceBoyform.value);
    
    this.submitted = true;
    if (this.serviceBoyform.valid) {
      this._loader.startLoader('loader');
      const mainForm = this.serviceBoyform.value;
      if (this.formType === 'Add') {
        this._api.addServiceBoy(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Service boy added successfully'
            })
            this._router.navigate(['/admin/service-boy/list']);
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
      if (this.formType === 'Edit' && this.serviceBoyId) {
        this._api.updateServiceBoy(this.serviceBoyId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Service boy updated successfully'
            })
            this._router.navigate(['/admin/service-boy/list']);
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
    }else{
      return;
    }
  }
  cancel(){
    this._router.navigate(['/admin/service-boy/list']);
  }

}
