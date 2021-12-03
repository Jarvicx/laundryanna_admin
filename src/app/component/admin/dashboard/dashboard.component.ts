import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from "src/app/service/api.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public dashboardData : any = {}
  public newPickUpCount : number = 0
  public deliveryCount : number = 0

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this._loader.startLoader('loader');
    this._api.getDashboardData().subscribe(
      res => {
        if (res.error === false) {
          this.dashboardData = res.data;
          this.newPickUpCount = res.data?.newPickup.length;
          this.deliveryCount = res.data?.readyToBeDelivered.length;
        }
        this._loader.stopLoader('loader');
      }, err => {
        this._loader.stopLoader('loader');
      }
    )
  }

}
