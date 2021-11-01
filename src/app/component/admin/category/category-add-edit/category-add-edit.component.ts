import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "../../../../service/api.service";
import  Swal  from "sweetalert2";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-add-edit',
  templateUrl: './category-add-edit.component.html',
  styleUrls: ['./category-add-edit.component.css']
})
export class CategoryAddEditComponent implements OnInit {
  public formType : any = 'Add';
  public categoryData : any = [];
  public errorMessage : any = '';
  public cityList : any = [];
  public companyList : any = [];
  public categoryId : any ='';
  public companyId : any = '';
  public categoryForm : FormGroup;
  fileData : any;
  previewUrl : any = '';
  submitted=false;
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
  constructor( private _api : ApiService, private _loader : NgxUiLoaderService, private _activeR : ActivatedRoute, private httpClient : HttpClient, private _router: Router,
    private fbuilder : FormBuilder) { 
    
    this.categoryId = this._activeR.snapshot.paramMap.get('categoryId') || '';
    console.log('this.categoryId',this.categoryId);
    if (this.categoryId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getCategoryById(this.categoryId).subscribe(
        res => {
          console.log(res);
          this.categoryForm.patchValue({
            companyId : res.data.companyId._id,
            parentId: res.data.parentId,
            city: res.data.city._id,
            name:  res.data.name,
            smallDesc: res.data.smallDesc,
            desc: res.data.desc,
            deliveryCharge: res.data.deliveryCharge,
            deliveryDuration: res.data.deliveryDuration,
            deliveryDurationText: res.data.deliveryDurationText,
            expressDeliveryCharge: res.data.expressDeliveryCharge,
            expressDeliveryDuration: res.data.expressDeliveryDuration,
            expressDeliveryDurationText: res.data.expressDeliveryDurationText,
            image: res.data.image
          })
        this._loader.stopLoader('loader')
      })
    }
    this.categoryForm = this.fbuilder.group({
      companyId:new FormControl('',Validators.required),
      parentId: new FormControl('sdf'),
      city:  new FormControl('',Validators.required),
      name:  new FormControl('',Validators.required),
      smallDesc:  new FormControl('',Validators.required),
      desc:  new FormControl('',Validators.required),
      deliveryCharge:  new FormControl('',Validators.required),
      deliveryDuration:  new FormControl('',Validators.required),
      deliveryDurationText:  new FormControl('',Validators.required),
      expressDeliveryCharge:  new FormControl('',Validators.required),
      expressDeliveryDuration:  new FormControl('',Validators.required),
      expressDeliveryDurationText:  new FormControl('',Validators.required),
      image: new FormControl('',Validators.required),
    })
    
  }

  ngOnInit(): void {
    this._api.getCityList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.cityList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
    this._api.getCompanyList().subscribe(
      res => {
        console.log(res);
        console.log(res.data);
        this.companyList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
    })
  }

  get f(){
    return this.categoryForm.controls;
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    console.log("fileData", this.fileData);
    this.preview();    
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }
  submitCategoryForm() {
    // formData.append('image', this.fileData);
    console.log('this.categoryForm',this.categoryForm);
    console.log('value',this.categoryForm.value);
    this.submitted = true;
    
    if (this.categoryForm.valid) {
      this._loader.startLoader('loader');
      const mainForm = this.categoryForm.value;
      if (this.formType === 'Add') {
        this._api.addCategory(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Category added successfully'
            })
            this._router.navigate(['/admin/category/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.categoryId) {
        this._api.updateCategory(this.categoryId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Category updated successfully'
            })
            this._router.navigate(['/admin/category/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
    } else {
      // this.errorMessage = 'Please fill out all the details';
      this._loader.stopLoader('loader');
      return;
    }
  }

  cancel(){
    this._router.navigate(['/admin/category/list']);
  }

}
