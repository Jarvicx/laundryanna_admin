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

  // ************* Customer Address ***************************//
  getCustomerAddressList(cust_id : any){
    return this._http.get<any>(_apiUrl + '/address/list-by-user/' + cust_id);
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
}

