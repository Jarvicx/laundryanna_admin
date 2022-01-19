import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from 'src/app/service/api.service';
import  Swal  from "sweetalert2";
@Component({
  selector: 'app-mother-category-list',
  templateUrl: './mother-category-list.component.html',
  styleUrls: ['./mother-category-list.component.css']
})
export class MotherCategoryListComponent implements OnInit {

  public motherCategoryList : any =[];
  public modalopen = false;

  constructor(private _api:ApiService, private _loader : NgxUiLoaderService){} 
    // private confirmationDialogService :  ConfirmationDialogService ) { }

  ngOnInit(): void {
    console.log('enter');
    this.motherCategoryListing();
  }

  motherCategoryListing(){
    this._loader.startLoader('loader');
    this._api.getMotherCategoryList().subscribe(
      res =>{
        console.log(res);
        this.motherCategoryList = res.data;
        this._loader.stopLoader('loader');
      },err =>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteModal(d_id:any){   
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this motherCategory?You can not view this motherCategory in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteMotherCategory(d_id).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.motherCategoryListing();
          },err =>{
           
            Swal.fire(
              'Not Deleted!',
              'Something wrong. Please try again.',
              'warning'
            )
            this._loader.stopLoader('loader');
          })
        
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    })
    // this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
    // .then((confirmed) => console.log('User confirmed:', confirmed))
    // .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  toggleStatus(itemId: any, status: boolean) {
    this._api.toggleMotherCategoryStatus(itemId, {status}).subscribe(
      res => {
        this.motherCategoryListing();
      }
    );
  }

}
