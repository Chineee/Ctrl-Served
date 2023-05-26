import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {HttpClientModule} from "@angular/common/http";
import {UserHttpService} from "./Services/user-http.service";
import { TestComponent } from './test/test.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { WaiterPageComponent } from './waiter-page/waiter-page.component';
import {WaiterHttpService} from "./Services/waiters-http.service";
import { TableComponentComponent } from './table-component/table-component.component';
import {TablesHttpService} from "./Services/tables-http.service";
import {SocketioService} from "./Services/socketio.service";
import {FormsModule} from "@angular/forms";
import { MenuListComponent } from './menu-list/menu-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import {OrdersHttpService} from "./Services/orders-http.service";
import {MenusHttpService} from "./Services/menus-http.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    TestComponent,
    RegisterPageComponent,
    WaiterPageComponent,
    TableComponentComponent,
    MenuListComponent,
    OrderListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: UserHttpService, useClass: UserHttpService},
    {provide: WaiterHttpService, useClass: WaiterHttpService},
    {provide: TablesHttpService, useClass: TablesHttpService},
    {provide: SocketioService, useClass: SocketioService},
    {provide: OrdersHttpService, useClass: OrdersHttpService},
    {provide: MenusHttpService, useClass: MenusHttpService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
