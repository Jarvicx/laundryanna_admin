import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css']
})
export class CompanySettingsComponent implements OnInit {
  public settingsData : any =[];
  constructor(private _api : ApiService, private _loader : NgxUiLoaderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('accessToken')) {
      this._loader.startLoader('loader');
      this._api.getSettings().subscribe(
        res=>{
          console.log(res.data);
          this.settingsData = res.data;
          this._loader.stopLoader('loader');
        },err =>{
          this._loader.stopLoader('loader');
        }
      )
    } else {
      this._api.logoutUser();
    }
  }

  
}
