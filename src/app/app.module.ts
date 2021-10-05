import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from "@angular/common";
import { FormsModule , ReactiveFormsModule, FormControl} from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "red",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 70,
  "bgsType": "ball-spin-clockwise",
  "blur": 3,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#1371bb",
  "fgsPosition": "center-center",
  "fgsSize": 80,
  "fgsType": "pulse",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40,40,40,0.42)",
  "pbColor": "#1371bb",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
};

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/layouts/header/header.component';
import { SidebarComponent } from './component/layouts/sidebar/sidebar.component';
import { DashboardComponent } from './component/admin/dashboard/dashboard.component';

import { AppRoutingModule } from './app-routing.module';
import { CityListComponent } from './component/admin/city/city-list/city-list.component';
import { CityAddEditComponent } from './component/admin/city/city-add-edit/city-add-edit.component';
import { ItemListComponent } from './component/admin/item/item-list/item-list.component';
import { ItemAddEditComponent } from './component/admin/item/item-add-edit/item-add-edit.component';
import { CategoryListComponent } from './component/admin/category/category-list/category-list.component';
import { CategoryAddEditComponent } from './component/admin/category/category-add-edit/category-add-edit.component';
import { LoginComponent } from './component/admin/auth/login/login.component';
import { RegistrationComponent } from './component/admin/auth/registration/registration.component';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './service/confirmation-dialog.service';
import { CompanyListComponent } from './component/admin/company/company-list/company-list.component';
import { CompanyAddEditComponent } from './component/admin/company/company-add-edit/company-add-edit.component';
import { SubCategoryListComponent } from './component/admin/sub_category/sub-category-list/sub-category-list.component';
import { SubCategoryAddEditComponent } from './component/admin/sub_category/sub-category-add-edit/sub-category-add-edit.component';
import { CustomerListComponent } from './component/admin/customer/customer-list/customer-list.component';
import { CustomerAddEditComponent } from './component/admin/customer/customer-add-edit/customer-add-edit.component';
import { CustomerAddressComponent } from './component/admin/customer/customer-address/customer-address.component';
import { CompanySettingsComponent } from './component/admin/master/company-settings/company-settings.component';
import { SettingUpdateComponent } from './component/admin/master/setting-update/setting-update.component';
import { TimeSlotListComponent } from './component/admin/company/time-slot-list/time-slot-list.component';
import { TimeSlotAddEditComponent } from './component/admin/company/time-slot-add-edit/time-slot-add-edit.component';
import { CustomerAddressListComponent } from './component/admin/customer/customer-address-list/customer-address-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    CityListComponent,
    CityAddEditComponent,
    ItemListComponent,
    ItemAddEditComponent,
    CategoryListComponent,
    CategoryAddEditComponent,
    LoginComponent,
    RegistrationComponent,
    ConfirmationDialogComponent,
    CompanyListComponent,
    CompanyAddEditComponent,
    SubCategoryListComponent,
    SubCategoryAddEditComponent,
    CustomerListComponent,
    CustomerAddEditComponent,
    CustomerAddressComponent,
    CompanySettingsComponent,
    SettingUpdateComponent,
    TimeSlotListComponent,
    TimeSlotAddEditComponent,
    CustomerAddressListComponent
  ],
  imports: [
    BrowserModule,AppRoutingModule,CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,BrowserAnimationsModule,NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgbModule
  ],
  providers: [ConfirmationDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
