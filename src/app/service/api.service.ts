import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

var originalURL = environment.apiUrl;
var _apiUrl = originalURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private header;

  constructor(private _http : HttpClient,private _router : Router) { 
    this.header = new HttpHeaders()
        .set("Authorization", 'Bearer ' + localStorage.getItem('accessToken'))
        .set("Content-Type","application/json")
        .set("Client-Type","SAAS-ADMIN");
  }
  // How to send the data + Header Example is below
  // return this.http.post<any>(_apiUrl + 'update/user/profile',data,{headers: this.header});

  routeIntended(path : any = ''){
    localStorage.setItem('routeIntended',path);
  }

  // Storing the User Info Locally
  storeUserLocally(data : any){
    let routeIntended = localStorage.getItem('routeIntended');
    localStorage.clear();
    localStorage.setItem('accessToken', data.data[1].accessToken);
    localStorage.setItem('userInfo',JSON.stringify(data.data[0]));
    window.location.href = environment.dasboardPath;
    // location.reload();
    // this._router.navigate([(routeIntended) ? routeIntended : '/admin/dashboard']);
  }

  updateUserLocally(data : any){
    localStorage.removeItem('userInfo');
    localStorage.setItem('userInfo',JSON.stringify(data));
  }

  // Logging Out the Current User
  logoutUser():void{
    localStorage.clear();
    window.location.href = environment.projectPath;
    location.reload();
  }

  // Checking the Authentication for User
  isAuthenticated(){
    return !!localStorage.getItem('accessToken');
  }

  getUserDetailsFromStorage(){
    let user = localStorage.getItem('userInfo');
    return JSON.parse(user || '{}');
  }

  //auth
  adminLoginApi(formData : any) {
    return this._http.post<any>(_apiUrl + '/admin/login', formData, {headers: this.header});
  }
  adminChangePassword(AdminId: any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/admin/change-password/' + AdminId, formData, {headers: this.header});
  }
  adminRegisterApi(formData : any) {
    return this._http.post<any>(_apiUrl + '/admin/create', formData, {headers: this.header});
  }

  // *************  City Api  ***************************//
  getDashboardData(){
    return this._http.get<any>(_apiUrl + '/dashboard', {headers: this.header})
  }

  // *************  City Api  ***************************//
  getCityList() {
    return this._http.get<any>(_apiUrl + '/city/list');
  }
  addCity(cityData : any) {
    return this._http.post<any>(_apiUrl + '/city/create', cityData, {headers: this.header});
  }
  getCityById(cityId : any) {
    return this._http.get<any>(_apiUrl + '/city/detail/' + cityId);
  }
  updateCity(cityId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/city/update/' + cityId, formData, {headers: this.header});
  }
  deleteCity(cityId : any) {
    return this._http.delete<any>(_apiUrl + '/city/delete/' + cityId,{headers: this.header});
  }
  
  // ************* mother category ***************************//
  getMotherCategoryList() {
    return this._http.get<any>(_apiUrl + '/mother-category/list');
  }
  addMotherCategory(formData : any) {
    return this._http.post<any>(_apiUrl + '/mother-category/create', formData, {headers: this.header});
  }
  getMotherCategoryById(motherCategoryId : any) {
    return this._http.get<any>(_apiUrl + '/mother-category/detail/' + motherCategoryId);
  }
  updateMotherCategory(motherCategoryId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/mother-category/update/' + motherCategoryId, formData, {headers: this.header});
  }
  toggleMotherCategoryStatus(motherCategoryId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/mother-category/toggle-status/' + motherCategoryId, formData, {headers: this.header});
  }
  deleteMotherCategory(motherCategoryId : any) {
    return this._http.delete<any>(_apiUrl + '/mother-category/delete/' + motherCategoryId,{headers: this.header});
  }
  // ************* category ***************************//
  getCategoryList() {
    return this._http.get<any>(_apiUrl + '/category/list');
  }
  addCategory(formData : any) {
    return this._http.post<any>(_apiUrl + '/category/create', formData, {headers: this.header});
  }
  getCategoryById(categoryId : any) {
    return this._http.get<any>(_apiUrl + '/category/detail/' + categoryId);
  }
  updateCategory(categoryId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/category/update/' + categoryId, formData, {headers: this.header});
  }
  toggleCategoryStatus(categoryId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/category/toggle-status/' + categoryId, formData, {headers: this.header});
  }
  deleteCategory(categoryId : any) {
    return this._http.delete<any>(_apiUrl + '/category/delete/' + categoryId,{headers: this.header});
  }

  // ************* Sub category ***************************//
  getSubCategory(){
    return this._http.get<any>(_apiUrl + '/sub-category/list');
  }
  deleteSubCategory(subCategoryId:any){
    return this._http.delete<any>(_apiUrl + '/sub-category/delete/'+subCategoryId, {headers : this.header})
  }
  addSubCategory(formData:any){
    return this._http.post<any>(_apiUrl + '/sub-category/create', formData,{headers : this.header})
  }
  getSubCategoryById(subCategoryId:any){
    return this._http.get<any>(_apiUrl + '/sub-category/detail/'+subCategoryId);
  }
  updateSubCategory(subCategoryId:any, formData : any){
    return this._http.patch<any>(_apiUrl + '/sub-category/update/'+subCategoryId,formData,{headers : this.header});
  }

  // ************* Company ***************************//
  getCompanyList() {
    return this._http.get<any>(_apiUrl + '/company/list');
  }
  addCompany(formData : any) {
    return this._http.post<any>(_apiUrl + '/company/create', formData);
  }
  getCompanyById(categoryId : any) {
    return this._http.get<any>(_apiUrl + '/company/detail/' + categoryId);
  }
  updateCompany(categoryId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/company/update/' + categoryId, formData, {headers: this.header});
  }
  deleteCompany(companyId : any) {
    return this._http.delete<any>(_apiUrl + '/company/delete/' + companyId,{headers: this.header});
  }

  // ************* Item ***************************//
  getItemList() {
    return this._http.get<any>(_apiUrl + '/item/list');
  }
  addItem(formData : any) {
    return this._http.post<any>(_apiUrl + '/item/create', formData, {headers: this.header});
  }
  getItemById(itemId : any) {
    return this._http.get<any>(_apiUrl + '/item/detail/' + itemId);
  }
  updateItem(itemId : any, formData : any) {
    return this._http.patch<any>(_apiUrl + '/item/update/' + itemId, formData, {headers: this.header});
  }
  deleteItem(itemId : any) {
    return this._http.delete<any>(_apiUrl + '/item/delete/' + itemId,{headers: this.header});
  }

  // ************* Customer ***************************//
  getCustomer(){
    return this._http.get<any>(_apiUrl + '/customer/list');
  }
  addCustomer(formData : any){
    return this._http.post<any>(_apiUrl + '/customer/create',formData);
  }
  deleteCustomer(customerId : any){
    return this._http.delete<any>(_apiUrl + '/customer/delete/'+customerId, {headers : this.header});
  }
  getCustomerById(customerId : any){
    return this._http.get<any>(_apiUrl + '/customer/detail/'+customerId);
  }
  updateCustomer(customerId: any, formData:any){
    return this._http.patch<any>(_apiUrl + '/customer/update/'+customerId,formData, {headers : this.header} );
  }

  customerSearch(keyWord : any){
    return this._http.get<any>(_apiUrl + '/customer/search?q='+keyWord);
  }
  customerSearchMobile(keyWord : any){
    return this._http.get<any>(_apiUrl + '/customer/search?mobile='+keyWord);
  }
  
  customerSearchByDate(startDate : any, endDate : any){
    return this._http.get<any>(_apiUrl + '/customer/search-by-date-range?startDate='+startDate+'&endDate='+endDate);
  }
  
  // ********************** store ***************************//
  getStoreOwners(){
    return this._http.get<any>(_apiUrl + '/store-owner/list');
  }
  addStoreOwners(formData : any){
    return this._http.post<any>(_apiUrl + '/store-owner/create',formData);
  }
  deleteStoreOwners(StoreOwnerId : any){
    return this._http.delete<any>(_apiUrl + '/store-owner/delete/'+StoreOwnerId, {headers : this.header});
  }
  getStoreOwnerById(StoreOwnerId : any){
    return this._http.get<any>(_apiUrl + '/store-owner/detail/'+StoreOwnerId);
  }
  updateStoreOwner(StoreOwnerId: any, formData:any){
    return this._http.patch<any>(_apiUrl + '/store-owner/update/'+StoreOwnerId,formData, {headers : this.header} );
  }

  // ********************** store ***************************//
  getStore(){
    return this._http.get<any>(_apiUrl + '/store/list');
  }
  addStore(formData : any){
    return this._http.post<any>(_apiUrl + '/store/create',formData);
  }
  deleteStore(StoreId : any){
    return this._http.delete<any>(_apiUrl + '/store/delete/'+StoreId, {headers : this.header});
  }
  getStoreById(StoreId : any){
    return this._http.get<any>(_apiUrl + '/store/detail/'+StoreId);
  }
  updateStore(StoreId: any, formData:any){
    return this._http.patch<any>(_apiUrl + '/store/update/'+StoreId,formData, {headers : this.header} );
  }

  // ************* Customer Address ***************************//
  getCustomerAddressList(cust_id : any){
    return this._http.get<any>(_apiUrl + '/address/list-by-user/' + cust_id);
  }
  createAddress(formvalue : any){
    return this._http.post<any>(_apiUrl + '/address/create',formvalue, {headers : this.header})
  }
  getCustomerAddressById(address_id : any){
    return this._http.get<any>(_apiUrl + '/address/detail/' + address_id);
  }
  updateAddress(address_id : any, formvalue : any){
    return this._http.patch<any>(_apiUrl + '/address/update/' + address_id, formvalue,{headers:this.header});
  }
  deleteAddress(addressId : any){
    return this._http.delete<any>(_apiUrl + '/address/delete/' + addressId, {headers:this.header});
  }



   // ************* Settings ***************************//
  getSettings(){
    return this._http.get<any>(_apiUrl + '/master/company-settings/get');
  }
  updateSettings(data : any, settingsID : any){
    return this._http.patch<any>(_apiUrl + '/master/company-settings/update/'+settingsID,data, {headers : this.header});
  }

  // ************* Time Slot ***************************//
  getTimeSlotByCompany(cId : any){
    return this._http.get<any>(_apiUrl + '/slot/list-by-company/' +cId);
  }
  createtime(formData:any){
    return this._http.post<any>(_apiUrl + '/slot/create',formData, {headers : this.header});
  }
  getTimeIDSlotByCompany(timeId : any){
    return this._http.get<any>(_apiUrl + '/slot/detail/' + timeId);
  }
  updatetime(formData:any, timeId:any){
    return this._http.patch<any>(_apiUrl + '/slot/update/' + timeId, formData, {headers:this.header});
  }
  deleteTimeSlot(timeId : any){
    return this._http.delete<any>(_apiUrl + '/slot/delete/' + timeId, {headers:this.header})
  }

  // ************* Service boy ***************************//
  getServiceBoyList() {
    return this._http.get<any>(_apiUrl + '/service-boys/list');
  }
  addServiceBoy(formData:any){
    return this._http.post<any>(_apiUrl + '/service-boys/create',formData, {headers:this.header});
  }
  getServiceBoyById(serviceBoyId:any){
    return this._http.get<any>(_apiUrl + '/service-boys/detail/'+ serviceBoyId, {headers:this.header});
  }

  updateServiceBoy(serviceBoyId:any, formData:any){
    return this._http.patch<any>(_apiUrl + '/service-boys/update/'+ serviceBoyId,formData, {headers:this.header});
  }
  
  deleteServiceBoy(s_id:any){
    return this._http.delete<any>(_apiUrl + '/service-boys/delete/'+ s_id, {headers:this.header});
  }

  // ************* Pick up ***************************//
  getPickUpList(){
    return this._http.get<any>(_apiUrl + '/pickup/list');
  }
  addPickUp(frmData:any){
    return this._http.post<any>(_apiUrl + '/pickup/create', frmData, {headers:this.header});
  }
  getPickID(pick_id:any){
    return this._http.get<any>(_apiUrl + '/pickup/detail/' + pick_id) //, {headers:this.header});
  }
  updatePickUp(pickUpId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/pickup/update/' + pickUpId, formData, {headers:this.header});
  }
  deletePickUp(pick_id:any){
    return this._http.delete<any>(_apiUrl + '/pickup/delete/' + pick_id, {headers:this.header});
  }
  updateStatus(pick_id:any, statusData:any){
    return this._http.patch<any>(_apiUrl + '/pickup/change-status/'+ pick_id, statusData, {headers:this.header});
  }

  pickupSearchByDate(inputDate : any){
    return this._http.get<any>(_apiUrl + '/pickup/search-by-date?date='+inputDate);
  }

  pickupSearchByDateRange(startDate : any, endDate : any){
    return this._http.get<any>(_apiUrl + '/pickup/search-by-date-range?startDate='+startDate+'&endDate='+endDate);
  }
  
  pickupSearchByStatus(status : any){
    return this._http.get<any>(_apiUrl + '/pickup/search-by-status?status='+status);
  }

  pickupCustomerSearch(keyWord : any){
    return this._http.get<any>(_apiUrl + '/pickup/universal-search?q='+keyWord);
  }
  pickupCustomerSearchMobile(keyWord : any){
    return this._http.get<any>(_apiUrl + '/pickup/universal-search?mobile='+keyWord);
  }

  //***************************offer *******************************/
  getOfferList(){
    return this._http.get<any>(_apiUrl + '/offer/list');
  }
  addOffer(formData:any){
    return this._http.post<any>(_apiUrl + '/offer/create', formData, {headers:this.header});
  }
  getOfferDetail(offerId:any){
    return this._http.get<any>(_apiUrl + '/offer/detail/' + offerId) //, {headers:this.header});
  }
  updateOffer(OfferId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/offer/update/' + OfferId, formData, {headers:this.header});
  }
  deleteOffer(offerId:any){
    return this._http.delete<any>(_apiUrl + '/offer/delete/' + offerId, {headers:this.header});
  }

  //***************************coupon *******************************/
  getCouponList(){
    return this._http.get<any>(_apiUrl + '/coupon/list');
  }
  addCoupon(formData:any){
    return this._http.post<any>(_apiUrl + '/coupon/create', formData, {headers:this.header});
  }
  getCouponDetail(CouponId:any){
    return this._http.get<any>(_apiUrl + '/coupon/detail/' + CouponId) //, {headers:this.header});
  }
  updateCoupon(CouponId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/coupon/update/' + CouponId, formData, {headers:this.header});
  }
  deleteCoupon(CouponId:any){
    return this._http.delete<any>(_apiUrl + '/coupon/delete/' + CouponId, {headers:this.header});
  }

  //***************************Plan *******************************/
  getPlanList(){
    return this._http.get<any>(_apiUrl + '/plan/list');
  }
  addPlan(formData:any){
    return this._http.post<any>(_apiUrl + '/plan/create', formData, {headers:this.header});
  }
  getPlanDetail(PlanId:any){
    return this._http.get<any>(_apiUrl + '/plan/detail/' + PlanId) //, {headers:this.header});
  }
  updatePlan(PlanId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/plan/update/' + PlanId, formData, {headers:this.header});
  }
  deletePlan(planId:any){
    return this._http.delete<any>(_apiUrl + '/plan/delete/' + planId, {headers:this.header});
  }

  //***************************Price *******************************/
  getPriceList(){
    return this._http.get<any>(_apiUrl + '/price/list');
  }
  addPrice(formData:any){
    return this._http.post<any>(_apiUrl + '/price/create', formData, {headers:this.header});
  }
  getPriceDetail(PriceId:any){
    return this._http.get<any>(_apiUrl + '/price/detail/' + PriceId) //, {headers:this.header});
  }
  updatePrice(PriceId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/price/update/' + PriceId, formData, {headers:this.header});
  }
  deletePrice(PriceId:any){
    return this._http.delete<any>(_apiUrl + '/price/delete/' + PriceId, {headers:this.header});
  }
  searchPrice(item: any, category: any){
    return this._http.get<any>(_apiUrl + '/price/search?item='+item+'&category='+category);
  }

  //***************************Rate Card *******************************/
  getRateCardList(){
    return this._http.get<any>(_apiUrl + '/rate-card/list');
  }
  addRateCard(formData:any){
    return this._http.post<any>(_apiUrl + '/rate-card/create', formData, {headers:this.header});
  }
  getRateCardDetail(RateCardId:any){
    return this._http.get<any>(_apiUrl + '/rate-card/detail/' + RateCardId) //, {headers:this.header});
  }
  updateRateCard(RateCardId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/rate-card/update/' + RateCardId, formData, {headers:this.header});
  }
  deleteRateCard(RateCardId:any){
    return this._http.delete<any>(_apiUrl + '/rate-card/delete/' + RateCardId, {headers:this.header});
  }

  //***************************Store *******************************/
  getStoreList(){
    return this._http.get<any>(_apiUrl + '/store/list');
  }


  //*************************** Order *******************************/
  getOrderList(){
    return this._http.get<any>(_apiUrl + '/order/list');
  }
  searchOrderByStore(searchData: string){
    return this._http.get<any>(_apiUrl + '/order/universal-search?id=&orderStatus=&paymentStatus=&store='+ searchData);
  }
  searchOrderById(searchData: string){
    return this._http.get<any>(_apiUrl + '/order/universal-search?id='+ searchData +'&orderStatus=&paymentStatus=&store=');
  }
  searchOrderByOrder(searchData: string){
    return this._http.get<any>(_apiUrl + '/order/universal-search?id=&orderStatus='+ searchData +'&paymentStatus=&store=');
  }
  searchOrderByPayment(searchData: string){
    return this._http.get<any>(_apiUrl + '/order/universal-search?id=&orderStatus=&paymentStatus='+ searchData +'&store=');
  }
  addOrder(formData:any){
    return this._http.post<any>(_apiUrl + '/order/create', formData, {headers:this.header});
  }
  getOrderDetail(OrderId:any){
    return this._http.get<any>(_apiUrl + '/order/detail/' + OrderId) //, {headers:this.header});
  }
  updateOrder(OrderId:any,formData:any){
    return this._http.patch<any>(_apiUrl + '/order/update/' + OrderId, formData, {headers:this.header});
  }
  deleteOrder(OrderId:any){
    return this._http.delete<any>(_apiUrl + '/order/delete/' + OrderId, {headers:this.header});
  }

}

