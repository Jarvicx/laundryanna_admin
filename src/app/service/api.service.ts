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
        // .set("Authorization", 'Bearer ' + localStorage.getItem('accessToken'))
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
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('userInfo',JSON.stringify(data));
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
    return this._http.post<any>(_apiUrl + 'login', formData, {headers: this.header});
  }

  //city
  getCityList() {
    return this._http.get<any>(_apiUrl + 'city');
  }
  addCity(formData : any) {
    return this._http.post<any>(_apiUrl + 'city', formData, {headers: this.header});
  }
  getCityById(cityId : any) {
    return this._http.get<any>(_apiUrl + 'city/' + cityId);
  }
  updateCity(cityId : any, formData : any) {
    return this._http.put<any>(_apiUrl + 'city/' + cityId, formData, {headers: this.header});
  }
  deleteCity(cityId : any) {
    return this._http.delete<any>(_apiUrl + 'city/' + cityId);
  }
  
  ///category
  getCategoryList() {
    return this._http.get<any>(_apiUrl + 'category');
  }
  addCategory(formData : any) {
    return this._http.post<any>(_apiUrl + 'category', formData, {headers: this.header});
  }
  getCategoryById(categoryId : any) {
    return this._http.get<any>(_apiUrl + 'category/' + categoryId);
  }
  updateCategory(categoryId : any, formData : any) {
    return this._http.put<any>(_apiUrl + 'category/' + categoryId, formData, {headers: this.header});
  }
  deleteCategory(categoryId : any) {
    return this._http.delete<any>(_apiUrl + 'category/' + categoryId);
  }


}