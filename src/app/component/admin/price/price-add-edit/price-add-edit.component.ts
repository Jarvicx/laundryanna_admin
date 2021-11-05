import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-price-add-edit',
  templateUrl: './price-add-edit.component.html',
  styleUrls: ['./price-add-edit.component.css']
})
export class PriceAddEditComponent implements OnInit {

  public formType : any = 'Add';
  public priceData : any = [];
  public itemData : any = [];
  public categoryData : any = [];
  public priceId : any = '';
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
    this.priceId = this._activate.snapshot.paramMap.get('priceId') || '';
    if(this.priceId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getPriceDetail(this.priceId).subscribe(
        res => {
          console.log(res);
          this.priceData = res.data;
          this._loader.stopLoader('loader')
        }
      )
    }
    this._api.getCategoryList().subscribe(
      res => {
        this.categoryData = res.data;
        if(!this.priceId) {
          this.priceData.category = res?.data[0]?._id || '';
        }
        console.log(this.categoryData);
        // console.log(''this.priceData);
      }
    )
    this._api.getItemList().subscribe(
      res => {
        this.itemData = res.data;
        if(!this.priceId) {
          this.priceData.item = res?.data[0]?._id || '';
        }
        console.log(this.categoryData);
        // console.log(''this.priceData);
      }
    )
  }

  ngOnInit(): void {
  }

  priceFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      if (this.formType === 'Add') {
        this._api.addPrice(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Price added successfully'
            })
            this._router.navigate(['/admin/price/list']);
            this._loader.stopLoader('loader');
  
          }, err => {
            this.errorMessage = 'Something went wrong!';
            this._loader.stopLoader('loader');
          }
        )
      }
      if (this.formType === 'Edit' && this.priceId) {
        this._api.updatePrice(this.priceId, mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Price updated successfully'
            })
            this._router.navigate(['/admin/price/list']);
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
