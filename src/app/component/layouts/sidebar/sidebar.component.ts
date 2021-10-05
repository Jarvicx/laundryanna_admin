import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor( private _api: ApiService) { }

  ngOnInit(): void {
  }
  
  logoutAdmin(){
    this._api.logoutUser();
  }

}
