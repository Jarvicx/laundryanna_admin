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
    { path: 'item', children: [
      { path: 'list', component: ItemListComponent },
      { path: 'add', component: ItemAddEditComponent },
      { path: 'edit/:itemId', component: ItemAddEditComponent },
    ]},
  ]},
  { path: '**', component: DashboardComponent, canActivate: [AuthCheckService] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }