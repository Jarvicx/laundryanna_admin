import { Component } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'laundryanna-admin';
  public showHeaderSidebar: boolean = true;

  constructor(private _router:Router) {
    _router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        // let url = event['url'];
        // let urlArr = url.split("/");
        // console.log(urlArr);
        
        this.showHeaderSidebar = true;

        if (event['url'] == '/login' || event['url'] == '/register') {
          this.showHeaderSidebar = false;
        }
      }
    });
  }
}
