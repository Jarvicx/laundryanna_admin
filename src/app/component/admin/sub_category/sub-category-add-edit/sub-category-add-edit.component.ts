import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-category-add-edit',
  templateUrl: './sub-category-add-edit.component.html',
  styleUrls: ['./sub-category-add-edit.component.css']
})
export class SubCategoryAddEditComponent implements OnInit {
  public subCategory : FormGroup;
  public submitted = false;
  public categoryList : any =[];
  public formType = 'Add';
  public subCategoryId :any = '';
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

  constructor(private fbuilder : FormBuilder, private _router : Router, private _api:ApiService, private _loader : NgxUiLoaderService,
              private _activatedRute : ActivatedRoute) {
    this.subCategoryId = this._activatedRute.snapshot.paramMap.get('subCategoryId') || '';
    console.log('1', this.subCategoryId);
    
    if (this.subCategoryId) {
      this._loader.startLoader('loader');
      this.formType='Edit';
      this._api.getSubCategoryById(this.subCategoryId).subscribe(
        res=>{
          console.log('*** res ***',res);
          this.subCategory.patchValue({
            name : res.data.name,
            category : res.data.category._id,     
            desc :  res.data.desc,
            smallDesc : res.data.smallDesc,
            image : res.data.name
          })
          this._loader.stopLoader('loader');
        },
        err=>{
          this._loader.stopLoader('loader');
        })
    }
  
    this.subCategory = this.fbuilder.group({
      name: new FormControl('', Validators.required),
      category : new FormControl('',Validators.required),     
      desc :  new FormControl('', Validators.required),
      smallDesc :  new FormControl('', Validators.required),
      image :  new FormControl('https://media.istockphoto.com/vectors/washing-machine-with-a-wash-basin-and-cleaning-stuff-vector-id1141658592?k=20&m=1141658592&s=612x612&w=0&h=FpNfdvX28sfE17zvGl8dGuhyYJu31X3UTCusmc6Ed2o=', Validators.required),
    })
  }

  ngOnInit(): void {
    this._loader.startLoader('loader');
    this._api.getCategoryList().subscribe(
      res =>{
        this.categoryList = res.data;
        this._loader.stopLoader('loader');
      },err=>{
        this._loader.stopLoader('loader');
      })
  }

  get f(){
    return this.subCategory.controls;
  }

  submitsubCategoryForm(){
    this.submitted = true;
    if (this.subCategory.valid) {
      this._loader.startLoader('loader');
      if (this.formType==='Add') {
        const mainForm = this.subCategory.value;
        this._api.addSubCategory(mainForm).subscribe(
          res =>{
            this.Toast.fire({
              icon: 'success',
              title: 'Sub Category added successfully'
            })
            this._router.navigate(['/admin/sub-category/list'])
            this._loader.stopLoader('loader');
          },err=>{
            this.Toast.fire({
              icon: 'error',
              title: 'Something wrong. Please try again.'
            })
            this._loader.stopLoader('loader');
          })
      }
      if (this.formType==='Edit' && this.subCategoryId) {
        const mainForm = this.subCategory.value;
        this._api.updateSubCategory(this.subCategoryId,mainForm).subscribe(
          res =>{
            this.Toast.fire({
              icon: 'success',
              title: 'Sub Category updated successfully'
            })
            this._router.navigate(['/admin/sub-category/list'])
            this._loader.stopLoader('loader');
          },err=>{
            this.Toast.fire({
              icon: 'error',
              title: 'Something wrong. Please try again.'
            })
            this._loader.stopLoader('loader');
          })
      }
    } else {
      return;
    }
  }

}
