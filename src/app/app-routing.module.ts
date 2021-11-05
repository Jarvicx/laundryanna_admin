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
import { CustomerAddressListComponent } from './component/admin/customer/customer-address-list/customer-address-list.component';
import { CustomerAddressComponent } from "./component/admin/customer/customer-address/customer-address.component";
import { CompanySettingsComponent } from './component/admin/master/company-settings/company-settings.component';
import { SettingUpdateComponent } from './component/admin/master/setting-update/setting-update.component';
import { TimeSlotListComponent } from './component/admin/company/time-slot-list/time-slot-list.component';
import { TimeSlotAddEditComponent } from './component/admin/company/time-slot-add-edit/time-slot-add-edit.component';
import { ServiceBoyListComponent } from "./component/admin/service_boy/service-boy-list/service-boy-list.component";
import { ServiceBoyAddComponent  } from "./component/admin/service_boy/service-boy-add/service-boy-add.component";
import { PickUpListComponent } from "./component/admin/pickUp/pick-up-list/pick-up-list.component";
import { PickUpAddEditComponent } from "./component/admin/pickUp/pick-up-add-edit/pick-up-add-edit.component";
import { OfferListComponent } from "./component/admin/offer/offer-list/offer-list.component";
import { OfferAddEditComponent } from "./component/admin/offer/offer-add-edit/offer-add-edit.component";
import { CouponListComponent } from "./component/admin/coupon/coupon-list/coupon-list.component";
import { CouponAddEditComponent } from "./component/admin/coupon/coupon-add-edit/coupon-add-edit.component";
import { PlanListComponent } from "./component/admin/plan/plan-list/plan-list.component";
import { PlanAddEditComponent } from "./component/admin/plan/plan-add-edit/plan-add-edit.component";
import { PriceAddEditComponent } from "./component/admin/price/price-add-edit/price-add-edit.component";
import { PriceListComponent } from "./component/admin/price/price-list/price-list.component";

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthCheckService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
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
    { path: 'customer-address', children: [
      { path: 'list/:customerId', component: CustomerAddressListComponent },
      { path: 'add/:customerId', component: CustomerAddressComponent },
      { path: 'edit/:customerId/:addressId', component: CustomerAddressComponent },
    ]},
    { path: 'master-settings', component: CompanySettingsComponent },
    { path: 'master-settings/edit/:settingsId', component: SettingUpdateComponent },

    { path: 'time-slot', children: [
      { path: 'list/:companyId', component: TimeSlotListComponent },
      { path: 'add/:companyId', component: TimeSlotAddEditComponent },
      { path: 'edit/:companyId/:timeId', component: TimeSlotAddEditComponent },
    ]},
    { path: 'service-boy', children: [
      { path: 'list', component: ServiceBoyListComponent },
      { path: 'add', component: ServiceBoyAddComponent },
      { path: 'edit/:serviceBoyId', component: ServiceBoyAddComponent },
    ]},
    { path: 'pick_up', children: [
      { path: 'list', component: PickUpListComponent },
      { path: 'add', component: PickUpAddEditComponent },
      { path: 'edit/:pickUpId', component: PickUpAddEditComponent },
    ]},
    { path: 'offer',children:[
      {path: 'list', component: OfferListComponent},
      {path: 'add', component: OfferAddEditComponent},
      {path: 'edit/:offerId', component: OfferAddEditComponent},
    ]},
    { path: 'coupon',children:[
      {path: 'list', component: CouponListComponent},
      {path: 'add', component: CouponAddEditComponent},
      {path: 'edit/:couponId', component: CouponAddEditComponent},
    ]},
    { path: 'plan',children:[
      {path: 'list', component: PlanListComponent},
      {path: 'add', component: PlanAddEditComponent},
      {path: 'edit/:planId', component: PlanAddEditComponent},
    ]},
    { path: 'price',children:[
      {path: 'list', component: PriceListComponent},
      {path: 'add', component: PriceAddEditComponent},
      {path: 'edit/:priceId', component: PriceAddEditComponent},
    ]},
    
  ]},
  { path: '**', component: DashboardComponent, canActivate: [AuthCheckService] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }