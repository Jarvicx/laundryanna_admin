import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import  Swal  from "sweetalert2";

import{ ApiService } from '../../../../service/api.service';

@Component({
  selector: 'app-company-add-edit',
  templateUrl: './company-add-edit.component.html',
  styleUrls: ['./company-add-edit.component.css']
})
export class CompanyAddEditComponent implements OnInit {
  public formType : any = 'Add'
  public errorMessage : any = ''
  public companyForm : FormGroup;
  companyId : any = ''
  submitted = false;
  hide = false;
  show_eye = false;
  isAddMode : boolean;

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

  constructor(private formBuilder : FormBuilder, private _loader : NgxUiLoaderService, private _api : ApiService,
    private _router : Router, private _activate : ActivatedRoute) {
    
    this.companyId = this._activate.snapshot.paramMap.get('companyId') || '';
    this.isAddMode = !this.companyId;
    console.log('**this.isAddMode value**',this.isAddMode);
        
    // password not required in edit mode
    const passwordValidators = [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$')];
    if (this.isAddMode) {
        passwordValidators.push(Validators.required);
    }
    if(this.companyId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getCompanyById(this.companyId).subscribe(
        res => {
          console.log(res.data);
          
          this.companyForm.patchValue
          ({
            name : res.data.name,
            phone: res.data.phone,
            email: res.data.email,
            addressLine1: res.data.addressLine1,
            addressLine2: res.data.addressLine2,
            country : res.data.country,
            state: res.data.state,
            city: res.data.city,
            pin:  res.data.pin,
            image: res.data.image,
            smallDesc : res.data.smallDesc,
            desc: res.data.desc
          }); 
         
          this._loader.stopLoader('loader')
        }
      )
    }
    this.companyForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('',[
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      password: ['', [this.isAddMode ? Validators.required : Validators.nullValidator, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$')]],
      confirmPassword: new FormControl('',this.isAddMode ? Validators.required : Validators.nullValidator),        
      phone : new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),     
      desc :  new FormControl('', Validators.required),
      smallDesc :  new FormControl('', Validators.required),
      addressLine1 :  new FormControl('', Validators.required),
      addressLine2 :  new FormControl(''),
      country :  new FormControl('', Validators.required),
      state :  new FormControl('', Validators.required),
      city :  new FormControl('', Validators.required),
      pin :  new FormControl('', [Validators.required,Validators.pattern("^[0-9]{7}$")]),
      image : new FormControl('https://media.istockphoto.com/vectors/washing-machine-with-a-wash-basin-and-cleaning-stuff-vector-id1141658592?k=20&m=1141658592&s=612x612&w=0&h=FpNfdvX28sfE17zvGl8dGuhyYJu31X3UTCusmc6Ed2o=')
    },{ 
      validator: this.isAddMode ? this.checkPasswords('password','confirmPassword') : Validators.nullValidator
    })
  };
  ngOnInit(): void {
  }
  fileProgress(event : any){

  }
  get f(){  
    return this.companyForm.controls;  
  }  
  checkPasswords(controlName: string, matchingControlName: string){
    return(group:FormGroup)=>{
      const passwrd = group.controls[controlName];
      const confirmPasswrd = group.controls[matchingControlName];
      console.log('p',passwrd);
      console.log('C',confirmPasswrd);
      
      if (confirmPasswrd.errors && !confirmPasswrd.errors.mustMatch) {
        return;
      }
      //set error on matchingControl if validation fails
      if (passwrd.value !== confirmPasswrd.value) {
        confirmPasswrd.setErrors({ confirmedValidator: true });   
      } else {
        confirmPasswrd.setErrors(null);
          
      }
    }
   }

  showPassword(){
    this.hide = !this.hide;
    this.show_eye = !this.show_eye;
  }
  submitCompanyForm(companyForm : any){
    this.submitted = true;
    console.log(this.companyForm.value);
    console.log('value',this.companyForm.valid);
    if (this.companyForm.valid) {
      this._loader.startLoader('loader');
      const mainForm = this.companyForm.value;
      if (this.formType === 'Add') {
        this._api.addCompany(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Company added successfully'
            })
            this._router.navigate(['/admin/company/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.companyId) {
        this._api.updateCompany(this.companyId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Company updated successfully'
            })
            this._router.navigate(['/admin/company/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
    }else{
      return;
    }
  }
  cancel(){
    this._router.navigate(['/admin/company/list']);
  }

}
