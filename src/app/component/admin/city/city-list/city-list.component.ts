import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css']
})
export class CityListComponent implements OnInit {

  public cityList : any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService ) { }

  ngOnInit(): void {
    this._loader.startLoader('loader');
    this._api.getCityList().subscribe(
      res => {
        this.cityList = res.data;
        this._loader.stopLoader('loader');
      }, err => {
        console.log(err);
        this._loader.stopLoader('loader');
      }
    )
  }



}
