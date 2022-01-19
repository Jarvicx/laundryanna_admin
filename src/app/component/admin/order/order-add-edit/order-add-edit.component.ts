import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public companySettings : any = {};
  public selectedCurrency : any = '';


  public orderCreateInfo = {
    cartDetail : [], pickup : '',
    store : '', customer : '',
    address : '', totalAmount : 0
  }

  constructor(private _api:ApiService,public _activRoute : ActivatedRoute,private _loader : NgxUiLoaderService, private _route: Router) {
    this.cartItem = {cart : []};
    this.pickUpId = this._activRoute.snapshot.paramMap.get('pickupId');
    if(this.pickUpId){
      this.cartItem.cart = [];
      this.updateCartItemToLocalStorage();
      this.getpickUpDetails(this.pickUpId);
    }
    this._api.getSettings().subscribe(
      res=>{
        this.companySettings = res.data[0];
        console.log(this.companySettings);
        this.selectedCurrency = (this.companySettings.currency === "INR") ? "₹" : "$"
        this._loader.stopLoader('loader');
      },err =>{
        this._loader.stopLoader('loader');
      }
    )
  }

  ngOnInit(): void {
    this.categoryListing();
    // this.rateCardListing();
    // this.itemListing();
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
        // res.data.forEach((val:any, index:any) => {
        //   var rateCardInfo = this.rateCardList.find((rateDetails:any) => (rateDetails.item === val?._id));
        //   if(rateCardInfo != undefined || rateCardInfo != null){
        //     if(rateCardInfo?.price != null || rateCardInfo?.price != 0) {
        //       this.itemList.push(val);
        //     }
        //   }
        // });
        this.itemList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }



  public rateCardList : any = [];
  rateCardListing(){
    this._loader.startLoader('loader');
    this._api.getRateCardDetail(this.pickUpDetails?.storeAssign?.rateCard).subscribe(
      res => {
        // console.log('ratecard respone', res);
        
        this.rateCardList = res.data?.rateDetails;
        this.itemListing(); // getting item listing
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

  getPriceForItemAndCategory(itemId:string, categoryId:string)
  {
    var itemInfo = this.rateCardList.find((rateDetails:any) => (rateDetails.item === itemId) && (rateDetails.category === categoryId));
    console.log('itemInfo', itemInfo);
    if(itemInfo == undefined){
      console.log('i am in undefined section')
      return 0;
    }
    return (((itemInfo?.price == null) || (itemInfo?.price == ""))? 0 : parseInt(itemInfo?.price));
  }

  getpickUpDetails(pickupid : string){
    this._api.getPickID(pickupid).subscribe(
      res => {
        if(res.error == false){
          this.pickUpDetails = res.data;
          this.rateCardListing();
          // console.log('pickup Details',this.pickUpDetails);
          this.updatingOrderCreateInfo();
        }
      }
    )
  }

  checkCurrentQuantityCount(itemInfo : any){
    let value = this.cartItem.cart.find(item => item.item === itemInfo?._id && item.category === this.selectedCategoryInfo?._id);
    if(value == undefined){
      // if Item not found in the cart then quantity set to be zero
      return 0;
    }
    return value.quantity;
  }

  addQuantity(productInfo : any){
    var itemInfo = this.cartItem.cart.find(cartItem => (cartItem.category === this.selectedCategoryInfo?._id) && (cartItem.item === productInfo._id));
    let price = this.getPriceForItemAndCategory(productInfo?._id,this.selectedCategoryInfo?._id);
    if(price != 0){
      if(itemInfo == undefined){
        itemInfo = {
          category : this.selectedCategoryInfo?._id,
          categoryName : this.selectedCategoryInfo?.name,
          // subCategory : '',
          // subCategoryName : '',
          item : productInfo?._id,
          itemName : productInfo?.name,
          itemImage : productInfo?.image,
          quantity : 1,
          price : price,
          // price : (this.selectedCategoryInfo?.deliveryCharge || 0),
        }
        this.cartItem.cart.unshift(itemInfo);
      }else{
        let nextQuantity = (itemInfo.quantity + 1);
        itemInfo.quantity = nextQuantity;
        itemInfo.price = itemInfo.quantity * price;
        // itemInfo.price = itemInfo.quantity * (this.selectedCategoryInfo?.deliveryCharge || 0);
      }
      this.updateCartItemToLocalStorage(); // updating the Cart in to LocalStorage
    } else {
      //alert here
      this.Toast.fire({
        icon: 'error',
        title: 'We do not provide that service'
      });
    }
  }

  removeQuantity(productInfo : any){
    var itemInfo = this.cartItem.cart.find(item => item.item === productInfo?._id && item.category === this.selectedCategoryInfo?._id);
    if(itemInfo == undefined){}
    else{
      let price = this.getPriceForItemAndCategory(productInfo?._id,this.selectedCategoryInfo?._id)
      let currentQuantity = ((itemInfo.quantity) - 1);
      if(currentQuantity > 0){
        itemInfo.quantity = ((itemInfo.quantity) - 1);
        itemInfo.price = itemInfo.quantity * price;
        // itemInfo.price = itemInfo.quantity * (this.selectedCategoryInfo?.deliveryCharge || 0);
      }else if(currentQuantity <= 0){
        itemInfo.quantity = 0;itemInfo.price = 0;
        this.cartItem.cart.forEach((value,index)=>{
            if(value.item === productInfo?._id && value.category === this.selectedCategoryInfo?._id){
              this.cartItem.cart.splice(index,1);
            }
        });
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
        if(cartElement.price > 0 && cartElement.quantity > 0){ // price and quantity is to be zero then skip to send to the api
          underCategoryInfo.totalItemsUnderSameCategory.push({
            item : cartElement.item,
            quantity : cartElement.quantity,
            price : cartElement.price,
          });
          underCategoryInfo.totalItemPriceForSameCategory += cartElement.price;
        }
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
          // subCategory : '',
          // subCategory : '618221e7bd1903f4430a861b',
          itemDetail : sameCategoryInfo?.totalItemsUnderSameCategory,
          totalPrice : sameCategoryInfo?.totalItemPriceForSameCategory
        });
      });
      this.orderCreateInfo.cartDetail = cartDetailsArray;
      this.orderCreateInfo.totalAmount = (this.totalCartValue + this.gstValue);
      // creating the Order
      console.log('final order Info',this.orderCreateInfo);
      this._api.addOrder(this.orderCreateInfo).subscribe(
        res => {
          if(res.error == false){
            this.cartItem = {cart : []}; // after successfully placed the order removing all Selected Item
            this.updateCartItemToLocalStorage(); // updating everything to local Storage
            this.Toast.fire({
              icon: 'success',
              title: 'Order Places success',
            });
            this._route.navigate(['/admin/order/list']);
            this._api.updateStatus( this.pickUpId, {status:'Order created'} ).subscribe();
          }
        },err => {
          this.Toast.fire({
            icon: 'error',
            title: 'Something went wrong please try after sometime'
          });
        }
      )
    }else{
      this.Toast.fire({
        icon: 'error',
        title: 'Please add item into cart'
      });
    }
  }
}

interface CARTSITEM {
  category : string,
  categoryName : string,
  item : string,
  itemName : string,
  itemImage : string,
  quantity : number,
  price : number,
}
// interface CARTSITEM {
//   category : string,
//   categoryName : string,
//   subCategory : any,
//   subCategoryName : string,
//   item : string,
//   itemName : string,
//   itemImage : string,
//   quantity : number,
//   price : number,
// }
