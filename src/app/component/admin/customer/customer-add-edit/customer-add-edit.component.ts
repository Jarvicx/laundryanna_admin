import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-add-edit',
  templateUrl: './customer-add-edit.component.html',
  styleUrls: ['./customer-add-edit.component.css']
})
export class CustomerAddEditComponent implements OnInit {
  public customerForm : FormGroup;
  submitted = false;
  public formType = 'Add'; 
  isAddMode : boolean;
  hide = true;
  show_eye = false;
  customerId : any = '';

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
  constructor( private fbuilder:FormBuilder,private _api:ApiService, private _router : Router, private _loader : NgxUiLoaderService,
               private _activRoute : ActivatedRoute) { 
    this.customerId = this._activRoute.snapshot.paramMap.get('customerId')
    this.isAddMode = !this.customerId;
    console.log('**this.isAddMode value**',this.isAddMode);
        
    // password not required in edit mode
    const passwordValidators = [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$')];
   if (this.isAddMode) {
      passwordValidators.push(Validators.required);
      
    }
    if(this.customerId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getCustomerById(this.customerId).subscribe(
        res=>{
          console.log(res.data);
          this.customerForm.patchValue({
            name: res.data.name,
            email: res.data.email,
            phone : res.data.phone,     
            gender : res.data.gender,
            age : res.data.age,
            wallet : res.data.wallet,
            image : res.data.image
          })
        this._loader.stopLoader('loader');
        },err=>{
          this._loader.stopLoader('loader');
        })
    }

      this.customerForm = this.fbuilder.group({
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
      wallet :  new FormControl(''),
      image : new FormControl('https://media.istockphoto.com/vectors/washing-machine-with-a-wash-basin-and-cleaning-stuff-vector-id1141658592?k=20&m=1141658592&s=612x612&w=0&h=FpNfdvX28sfE17zvGl8dGuhyYJu31X3UTCusmc6Ed2o=')
    },{ 
      validator: this.isAddMode ? this.checkPasswords('password','conFirmpassword') : Validators.nullValidator
    })
  };
   

  ngOnInit(): void {
  }

  get f(){
    return this.customerForm.controls;
  }

  checkPasswords(controlName: string, matchingControlName: string){
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

  showPassword(){
    this.hide = !this.hide;
    this.show_eye = !this.show_eye;
  }
  submitCustomer(){
    console.log('ValidValue',this.customerForm.valid);
    
    this.submitted = true;
    if (this.customerForm.valid) {
      this._loader.startLoader('loader');
      const mainForm = this.customerForm.value;
      if (this.formType === 'Add') {
        this._api.addCustomer(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Customer added successfully'
            })
            this._router.navigate(['/admin/customer/list']);
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
      if (this.formType === 'Edit' && this.customerId) {
        this._api.updateCustomer(this.customerId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Customer updated successfully'
            })
            this._router.navigate(['/admin/customer/list']);
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
    } else {
      return;
    }
  }
  cancel(){
    this._router.navigate(['/admin/customer/list'])
  }

}
