import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-order-add-edit',
  templateUrl: './order-add-edit.component.html',
  styleUrls: ['./order-add-edit.component.css']
})
export class OrderAddEditComponent implements OnInit {

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

  public cartItem :  {cart: CARTSITEM[];};
  public pickUpId : any = '';
  public pickUpDetails : any = {};

  public orderCreateInfo = {
    cartDetail : [], pickup : '',
    store : '', customer : '',
    address : '', totalAmount : 0
  }

  constructor(private _api:ApiService,public _activRoute : ActivatedRoute,private _loader : NgxUiLoaderService) {
    this.cartItem = {cart : []};
    this.pickUpId = this._activRoute.snapshot.paramMap.get('pickupId');
    if(this.pickUpId){
      this.getpickUpDetails(this.pickUpId);
    }
  }

  ngOnInit(): void {
    this.categoryListing();
    this.itemListing();
    this.existingCartCheck();
  }

  public categoryList : any = [];
  categoryListing(){
    this._loader.startLoader('loader');
    this._api.getCategoryList().subscribe(
      res =>{
        this.categoryList = res.data;let keepgoing = true;
        this.categoryList.forEach((element : any,index : any)=>{
          if(keepgoing){
            this.selectedCategoryInfo = element;
            keepgoing = false;
          }
        });
        this._loader.stopLoader('loader');
      },err =>{
        this._loader.stopLoader('loader');
      }
    )
  }

  public selectedCategoryInfo : any = {};
  changeSelectedCatgeory(categoryInfo : any){
    this.selectedCategoryInfo = categoryInfo;
    // console.log('selected category info',this.selectedCategoryInfo);
  }

  public itemList : any = [];
  itemListing(){
    this._loader.startLoader('loader');
    this._api.getItemList().subscribe(
      res => {
        this.itemList = res.data;
        // console.log('itemList',this.itemList);
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

  getpickUpDetails(pickupid : string){
    this._api.getPickID(pickupid).subscribe(
      res => {
        if(res.error == false){
          this.pickUpDetails = res.data;
          console.log('pickup Details',this.pickUpDetails);
          this.updatingOrderCreateInfo();
        }
      }
    )
  }

  checkCurrentQuantityCount(itemInfo : any){
    let value = this.cartItem.cart.find(item => item.item === itemInfo?._id && item.category === this.selectedCategoryInfo?._id);
    if(value == undefined){ // if Item not found in the cart then quantity set to be zero
      return '0';
    }
    return value.quantity;
  }

  addQuantity(productInfo : any){
    var itemInfo = this.cartItem.cart.find(cartItem => (cartItem.category === this.selectedCategoryInfo?._id) && (cartItem.item === productInfo._id));
    if(itemInfo == undefined){
      itemInfo = {
        category : this.selectedCategoryInfo?._id,
        categoryName : this.selectedCategoryInfo?.name,
        subCategory : '',
        item : productInfo?._id,
        itemName : productInfo?.name,
        itemImage : productInfo?.image,
        quantity : 1,
        price : (this.selectedCategoryInfo?.deliveryCharge || 0),
      }
      this.cartItem.cart.push(itemInfo);
    }else{
      let nextQuantity = (itemInfo.quantity + 1);
      itemInfo.quantity = nextQuantity;
      itemInfo.price = itemInfo.quantity * (this.selectedCategoryInfo?.deliveryCharge || 0);
    }
    this.updateCartItemToLocalStorage(); // updating the Cart in to LocalStorage
  }

  removeQuantity(productInfo : any){
    var itemInfo = this.cartItem.cart.find(item => item.item === productInfo?._id && item.category === this.selectedCategoryInfo?._id);
    if(itemInfo == undefined){}
    else{
      let currentQuantity = ((itemInfo.quantity) - 1);
      if(currentQuantity > 0){
        itemInfo.quantity = ((itemInfo.quantity) - 1);
        itemInfo.price = itemInfo.quantity * (this.selectedCategoryInfo?.deliveryCharge || 0);
      }else if(currentQuantity <= 0){
        itemInfo.quantity = 0;itemInfo.price = 0;
        this.cartItem.cart = this.cartItem.cart.filter(item => item.item !== productInfo?._id && item.category != this.selectedCategoryInfo?._id); // removing the item from cart
      }
      this.updateCartItemToLocalStorage(); // updating the Cart in to LocalStorage
    }
  }

  updatingOrderCreateInfo(){
    this.orderCreateInfo.pickup = this.pickUpDetails?._id;
    this.orderCreateInfo.store = this.pickUpDetails?.storeAssign?._id;
    this.orderCreateInfo.customer = this.pickUpDetails?.customerId?._id;
    this.orderCreateInfo.address = this.pickUpDetails?.addressId?._id;
    // console.log('Order Create Info after getting pickupDetails',this.orderCreateInfo);
  }

  existingCartCheck(){
    let existingCart =  JSON.parse(localStorage.getItem('allCartItems') || '[]');
    if(existingCart != null){
      this.cartItem.cart = existingCart;
      this.checkCurrentCartValue();
    }
  }
  
  updateCartItemToLocalStorage(){ // updating the Cart in to LocalStorage
    localStorage.setItem('allCartItems',JSON.stringify(this.cartItem.cart));
    this.checkCurrentCartValue();
  }

  public totalCartValue : any = 0;public gstValue : any = 0;
  checkCurrentCartValue(){
    this.totalCartValue = this.cartItem.cart.reduce((accumulator:any, current:any) => parseFloat(accumulator) + parseFloat(current.price), 0);
  }

  itemListUnderSameCategory(categoryInfo : any){
    var underCategoryInfo : any = {totalItemsUnderSameCategory : [],totalItemPriceForSameCategory : 0};
    this.cartItem.cart.forEach((cartElement : any,cartIndex : any)=>{
      if(cartElement.category === categoryInfo.category && cartElement.categoryName === categoryInfo.categoryName){
        underCategoryInfo.totalItemsUnderSameCategory.push({
          item : cartElement.item,
          quantity : cartElement.quantity,
          price : cartElement.price,
        });
        underCategoryInfo.totalItemPriceForSameCategory += cartElement.price;
      }
    });
    return underCategoryInfo;
  }

  submitCartProductInfo(){
    if(this.cartItem.cart?.length > 0 ){
      // getting unique category data
      let uniqueCategoryDetails = this.cartItem.cart.filter((thing:any, i : any, arr : any) => {
        return arr.indexOf(arr.find((t : any) => t.category === thing.category && t.categoryName === thing.categoryName)) === i;
      });
      // making cartDetails Array
      let cartDetailsArray : any = [];
      uniqueCategoryDetails.forEach((categoryElement : any,categoryIndex : any)=>{
        let sameCategoryInfo =  this.itemListUnderSameCategory(categoryElement);
        cartDetailsArray.push({
          category : categoryElement.category,
          subCategory : '',
          itemDetail : sameCategoryInfo.totalItemsUnderSameCategory,
          totalPrice : sameCategoryInfo.totalItemPriceForSameCategory
        });
      });
      this.orderCreateInfo.cartDetail = cartDetailsArray;
      this.orderCreateInfo.totalAmount = (this.totalCartValue + this.gstValue);
      console.log('Full Object',this.orderCreateInfo);
    }else{
      this.Toast.fire({
        icon: 'error',
        title: 'Please add item into cart'
      })
    }
  }
}

interface CARTSITEM {
  category : string,
  categoryName : string,
  subCategory : string,
  item : string,
  itemName : string,
  itemImage : string,
  quantity : number,
  price : number,
}
