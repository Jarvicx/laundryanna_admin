import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from '../../../../service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-add-edit',
  templateUrl: './item-add-edit.component.html',
  styleUrls: ['./item-add-edit.component.css']
})
export class ItemAddEditComponent implements OnInit {
  public itemForm : FormGroup;
  submitted = false;
  public companyList : any =[];
  public formType ='Add';
  public itemId = '';

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

  constructor(private fb : FormBuilder, private _api: ApiService, private _loader :NgxUiLoaderService,private _router: Router,
              private activatedRoute :ActivatedRoute ) { 
    
    this.itemId = this.activatedRoute.snapshot.paramMap.get('itemId')|| '';
    if (this.itemId) {
      this._loader.startLoader('loader')
      this.formType='Edit';
      this._api.getItemById(this.itemId).subscribe(
        res => {
          console.log(res.data);
          
          this.itemForm.patchValue ({
            name : res.data.name,
            companyId :res.data.companyId._id,
            desc : res.data.desc,
            smallDesc : res.data.smallDesc,
            image : res.data.image
          })
          this._loader.stopLoader('loader');
        }, err => {
      })
    }
    this.itemForm = this.fb.group({
      name: new FormControl('', Validators.required),
      companyId : new FormControl('',Validators.required),     
      desc :  new FormControl('', Validators.required),
      smallDesc :  new FormControl('', Validators.required),
      image :  new FormControl('https://media.istockphoto.com/vectors/washing-machine-with-a-wash-basin-and-cleaning-stuff-vector-id1141658592?k=20&m=1141658592&s=612x612&w=0&h=FpNfdvX28sfE17zvGl8dGuhyYJu31X3UTCusmc6Ed2o=', Validators.required),
    })
  }

  ngOnInit(): void {
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
    return this.itemForm.controls;  
  } 
  submitItemForm(itemForm : any){
    this.submitted = true;
    if (this.itemForm.valid) {
      if (this.formType ==='Add') {
        this._loader.startLoader('loader')
        const mainForm = this.itemForm.value;
        this._api.addItem(mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Item added successfully'
            })
            this._router.navigate(['/admin/item/list']);
            this._loader.stopLoader('loader');
          }, err => {
            console.log(err);
            this._loader.stopLoader('loader');
        })
      }
      if (this.formType ==='Edit' && this.itemId) {
        this._loader.startLoader('loader')
        const mainForm = this.itemForm.value;
        this._api.updateItem(this.itemId,mainForm).subscribe(
          res => {
            this.Toast.fire({
              icon: 'success',
              title: 'Item updated successfully'
            })
            this._router.navigate(['/admin/item/list']);
            this._loader.stopLoader('loader');
          }, err => {
            console.log(err);
            this._loader.stopLoader('loader');
        })
      }
    } else {
      return;
    }
  } 

}
