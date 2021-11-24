import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-order-add-edit',
  templateUrl: './order-add-edit.component.html',
  styleUrls: ['./order-add-edit.component.css']
})
export class OrderAddEditComponent implements OnInit {

  public cartItem :  {cart: CARTSITEM[];};
  public pickUpId : any = '';
  public pickUpDetails : any = {};

  public orderCreateInfo = {
    cartDetail : [], pickup : '',
    store : '', customer : '',
    address : '', totalAmount : 0
  }

  constructor(private _api:ApiService,public _activRoute : ActivatedRoute) {
    this.cartItem = {cart : []};
    this.pickUpId = this._activRoute.snapshot.paramMap.get('pickupId');
    if(this.pickUpId){
      this.getpickUpDetails(this.pickUpId);
    }
  }

  ngOnInit(): void {

  }

  getpickUpDetails(pickupid : string){
    this._api.getPickID(pickupid).subscribe(
      res => {
        console.log('PickupDetials',res);
      }
    )
  }
  

  updateCartItemToLocalStorage(){ // updating the Cart in to LocalStorage
    localStorage.setItem('allCartItems',JSON.stringify(this.cartItem.cart));
  }
}

interface CARTSITEM {
  category : string,
  subCategory : string,
  item : string,
  quantity : number,
  price : number,
}
