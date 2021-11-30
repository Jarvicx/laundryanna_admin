import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";


@Component({
  selector: 'app-store-geofencing',
  templateUrl: './store-geofencing.component.html',
  styleUrls: ['./store-geofencing.component.css']
})
export class StoreGeofencingComponent implements OnInit {

  public storeData: any = '';
  
  public polygon: any = [];
  public locationList: any = [];
  public storeId: any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false
  });
  public options: any = {
    componentRestrictions:{
      country:["IN"]
    }
  }

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService,private _activate : ActivatedRoute, private _router : Router ) { }

  ngOnInit(): void {
    this.storeId = this._activate.snapshot.paramMap.get('storeId') || '';
    if(this.storeId) {
      this._loader.startLoader('loader');
      this._api.getStoreById(this.storeId).subscribe(
        res => {
          console.log("store detail", res);
          this.storeData = res.data;
          this.polygon = res.data?.geoFence;
          res.data?.geoFence.forEach((val: any, index: any) => {
            this.setLocation(val);
          });
          this._loader.stopLoader('loader')
        }
      )
    }
  }

  public AddressChange(address: any) {
    //setting address from API to local variable
    console.log("Google location:",address);
    this.storeData.lat = address.geometry.location.lat();
    this.storeData.lon = address.geometry.location.lng();
    this.polygon.push(
      { lat: address.geometry.location.lat(), lng: address.geometry.location.lng() }
    );
    this.locationList.push(address.formatted_address)
  }
  
  markerDragEnd($event: any) {
    console.log($event);
    this.polygon.push(
      { lat: $event.latLng.lat(), lng: $event.latLng.lng() }
    );
    this.setLocation({ lat: $event.latLng.lat(), lng: $event.latLng.lng() });
  }

  setLocation(latLng : any) {
    let geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ 'location': latLng }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK' && results) {
        this.locationList.push(results[0].formatted_address);
      } 
      // else {
      //   window.alert('Geocoder failed due to: ' + status);
      // }

    });
  }

  storeFormSubmit() {
    if (this.polygon.length >= 3) {
      let mainForm = {
        geoFence: this.polygon
      }
      this._api.updateStore(this.storeId, mainForm).subscribe(
        res => {
          this.Toast.fire({
            icon: 'success',
            title: 'Geo fencing added successfully'
          })
          this._router.navigate(['/admin/store/list']);
          this._loader.stopLoader('loader');

        }, err => {
          this.Toast.fire({
            icon: 'error',
            title: 'Operation failed'
          })
          this._loader.stopLoader('loader');
        }
      )
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Choose at lest three coordinates'
      })
      this._loader.stopLoader('loader');
    }
  }

  removePointer(index : any) {
    this.polygon.splice(index, 1);
    this.locationList.splice(index, 1);
  }

}
