import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCheckService } from "src/app/service/auth-check.service";
import { LoginComponent } from "./component/admin/auth/login/login.component";
import { RegistrationComponent } from "./component/admin/auth/registration/registration.component";
import { DashboardComponent } from './component/admin/dashboard/dashboard.component';
import { CityListComponent } from "./component/admin/city/city-list/city-list.component";
import { CityAddEditComponent } from "./component/admin/city/city-add-edit/city-add-edit.component";
import { CategoryListComponent } from "./component/admin/category/category-list/category-list.component";
import { CategoryAddEditComponent } from "./component/admin/category/category-add-edit/category-add-edit.component";
import { ItemListComponent } from "./component/admin/item/item-list/item-list.component";
import { ItemAddEditComponent } from "./component/admin/item/item-add-edit/item-add-edit.component";
import { CompanyListComponent } from './component/admin/company/company-list/company-list.component';
import { CompanyAddEditComponent } from './component/admin/company/company-add-edit/company-add-edit.component';
import { SubCategoryListComponent } from './component/admin/sub_category/sub-category-list/sub-category-list.component';
import { SubCategoryAddEditComponent } from './component/admin/sub_category/sub-category-add-edit/sub-category-add-edit.component';
import { CustomerListComponent } from './component/admin/customer/customer-list/customer-list.component';
import { CustomerAddEditComponent } from './component/admin/customer/customer-add-edit/customer-add-edit.component';
import { CompanySettingsComponent } from './component/admin/master/company-settings/company-settings.component';
import { SettingUpdateComponent } from './component/admin/master/setting-update/setting-update.component';
import { TimeSlotListComponent } from './component/admin/company/time-slot-list/time-slot-list.component';
import { TimeSlotAddEditComponent } from './component/admin/company/time-slot-add-edit/time-slot-add-edit.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthCheckService] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', canActivate: [AuthCheckService], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'city', children: [
      { path: 'list', component: CityListComponent },
      { path: 'add', component: CityAddEditComponent },
      { path: 'edit/:cityId', component: CityAddEditComponent },
    ]},
    { path: 'category', children: [
      { path: 'list', component: CategoryListComponent },
      { path: 'add', component: CategoryAddEditComponent },
      { path: 'edit/:categoryId', component: CategoryAddEditComponent },
    ]},
    { path: 'sub-category', children: [
      { path: 'list', component: SubCategoryListComponent },
      { path: 'add', component: SubCategoryAddEditComponent },
      { path: 'edit/:subCategoryId', component: SubCategoryAddEditComponent },
    ]},
    { path: 'item', children: [
      { path: 'list', component: ItemListComponent },
      { path: 'add', component: ItemAddEditComponent },
      { path: 'edit/:itemId', component: ItemAddEditComponent },
    ]},
    { path: 'company', children: [
      { path: 'list', component: CompanyListComponent },
      { path: 'add', component: CompanyAddEditComponent },
      { path: 'edit/:companyId', component: CompanyAddEditComponent },
    ]},
    { path: 'customer', children: [
      { path: 'list', component: CustomerListComponent },
      { path: 'add', component: CustomerAddEditComponent },
      { path: 'edit/:customerId', component: CustomerAddEditComponent },
    ]},
    { path: 'master-settings', component: CompanySettingsComponent },
    { path: 'master-settings/edit/:settingsId', component: SettingUpdateComponent },

    { path: 'time-slot', children: [
      { path: 'list/:companyId', component: TimeSlotListComponent },
      { path: 'add/:companyId', component: TimeSlotAddEditComponent },
      { path: 'edit/:companyId/:timeId', component: TimeSlotAddEditComponent },
    ]},
    // { path: 'customer-address',children:[
    //   {path: 'list/:customerID', component:''}
    // ]}
    
  ]},
  { path: '**', component: DashboardComponent, canActivate: [AuthCheckService] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }