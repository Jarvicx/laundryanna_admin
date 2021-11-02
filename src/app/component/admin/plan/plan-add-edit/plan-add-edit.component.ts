import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-plan-add-edit',
  templateUrl: './plan-add-edit.component.html',
  styleUrls: ['./plan-add-edit.component.css']
})
export class PlanAddEditComponent implements OnInit {

  public formType : any = 'Add';
  public planData : any = [];
  public categoryData : any = [];
  public planId : any = '';
  public today : any = getDateFormat(Date.now());
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

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService, private _router : Router, private _activate : ActivatedRoute ) { 
    this.planId = this._activate.snapshot.paramMap.get('planId') || '';
    if(this.planId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getPlanDetail(this.planId).subscribe(
        res => {
          console.log(res);
          this.planData = res.data;
          this.planData.category = res.data?.category?._id || '';
          this._loader.stopLoader('loader')
        }
      )
    }
    this._api.getCategoryList().subscribe(
      res => {
        this.categoryData = res.data;
        if(!this.planId) {
          this.planData.category = res?.data[0]?._id || '';
        }
        console.log(this.categoryData);
        // console.log(''this.planData);
      }
    )
  }

  ngOnInit(): void {
  }

  planFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      if (this.formType === 'Add') {
        this._api.addPlan(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Plan added successfully'
            })
            this._router.navigate(['/admin/plan/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.planId) {
        this._api.updatePlan(this.planId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Plan updated successfully'
            })
            this._router.navigate(['/admin/plan/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
      this._loader.stopLoader('loader');
    }
  }

}
