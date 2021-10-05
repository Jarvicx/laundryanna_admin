import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from '../../../../service/api.service';
import  Swal  from "sweetalert2";
// import { ConfirmationDialogService } from '../../../../service/confirmation-dialog.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  public categoryList : any =[];
  public modalopen = false;

  constructor(private _api:ApiService, private _loader : NgxUiLoaderService){} 
    // private confirmationDialogService :  ConfirmationDialogService ) { }

  ngOnInit(): void {
    console.log('enter');
    this.categoryListing();
  }

  categoryListing(){
    this._loader.startLoader('loader');
    this._api.getCategoryList().subscribe(
      res =>{
        console.log(res);
        this.categoryList = res.data;
        this._loader.stopLoader('loader');
      },err =>{
        this._loader.stopLoader('loader');
      }
    )
  }

  deleteModal(d_id:any){   
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to permanently delete this category?You can not view this category in your list',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete permanently',
      cancelButtonText: 'Close'
    }).then((result) => {
      console.log(result);
      if (result.value) {
        this._loader.startLoader('loader');
        this._api.deleteCategory(d_id).subscribe(
          res => {
            console.log('del',res);
            
            Swal.fire(
              'Deleted!',
              'Successfully deleted.',
              'success'
            )
            this.categoryListing();
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

}
