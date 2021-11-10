import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-rate-card-add-edit',
  templateUrl: './rate-card-add-edit.component.html',
  styleUrls: ['./rate-card-add-edit.component.css']
})
export class RateCardAddEditComponent implements OnInit {

  public rate : {details: RATEDETAILS[];};

  public formType : any = 'Add';
  public rateCardData : any = [];
  public itemData : any = [];
  public categoryData : any = [];
  public rateCardId : any = '';
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
    this.rate = {details : []};
    this.rateCardId = this._activate.snapshot.paramMap.get('rateCardId') || '';
    if(this.rateCardId) {
      this._loader.startLoader('loader');
      this.formType = 'Edit';
      this._api.getRateCardDetail(this.rateCardId).subscribe(
        res => {
          console.log(res);
          this.rateCardData = res.data;
          this._loader.stopLoader('loader')
        }
      )
    }
    this._api.getCategoryList().subscribe(
      res => {
        this.categoryData = res.data;

        console.log(this.categoryData);
      }
    )
    this._api.getItemList().subscribe(
      res => {
        this.itemData = res.data;
        this.itemData.forEach((element:any,index:any)=>{
          this.rate.details.push({
            item : element._id,
            category : '',
            price : 0,
          });
        });
        console.log(this.itemData);
      }
    )
  }

  ngOnInit(): void {
  }

  rateCardFormSubmit(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    console.log(formData.value);
    
    // if (formData?.valid) {
    //   this._loader.startLoader('loader');
    //   const mainForm = formData.value;
    //   if (this.formType === 'Add') {
    //     this._api.addRateCard(mainForm).subscribe(
    //       res => {
    //         this.Toast.fire({
    //           icon: 'success',
    //           title: 'Rate card added successfully'
    //         })
    //         this._router.navigate(['/admin/rate-card/list']);
    //         this._loader.stopLoader('loader');
  
    //       }, err => {
    //         this.errorMessage = 'Something went wrong!';
    //         this._loader.stopLoader('loader');
    //       }
    //     )
    //   }
    //   if (this.formType === 'Edit' && this.rateCardId) {
    //     this._api.updateRateCard(this.rateCardId, mainForm).subscribe(
    //       res => {
    //         this.Toast.fire({
    //           icon: 'success',
    //           title: 'Rate card updated successfully'
    //         })
    //         this._router.navigate(['/admin/rate-card/list']);
    //         this._loader.stopLoader('loader');
  
    //       }, err => {
    //         this.errorMessage = 'Something went wrong!';
    //         this._loader.stopLoader('loader');
    //       }
    //     )
    //   }
    // } else {
    //   this.errorMessage = 'Please fill out all the details';
    //   this._loader.stopLoader('loader');
    // }
  }

}

interface RATEDETAILS {
  category : string,
  item : string,
  price : number
}
