import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.css']
})
export class StoreDetailComponent implements OnInit {

  public storeData: any = '';
  
  public polygon: any = [];

  constructor( private _api : ApiService, private _loader : NgxUiLoaderService,private _activate : ActivatedRoute ) { }

  ngOnInit(): void {
    let storeId = this._activate.snapshot.paramMap.get('storeId') || '';
    if(storeId) {
      this._loader.startLoader('loader');
      this._api.getStoreById(storeId).subscribe(
        res => {
          console.log("store detail", res);
          this.storeData = res.data;
          this.polygon = res.data?.geoFence;
          this._loader.stopLoader('loader')
        }
      )
    }
  }

}
