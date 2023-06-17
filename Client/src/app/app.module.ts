import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {HttpClientModule} from "@angular/common/http";
import {UserHttpService} from "./Services/user-http.service";
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
import { CreateOrderComponent } from './create-order/create-order.component';
import {MakerPageComponent} from './makers-page/makers-page.component';
import {QueueHttpService} from "./Services/queue-http.service";
import { QueueComponent } from './queue/queue.component';
import { CashierPageComponent } from './cashier-page/cashier-page.component';
import {ReceiptsHttpService} from "./Services/receipts-http.service";
import { ReceiptsListComponent } from './receipts-list/receipts-list.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import { StatsPageComponent } from './stats-page/stats-page.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgOptimizedImage} from "@angular/common";
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { TableManagementComponent } from './table-management/table-management.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    WaiterPageComponent,
    TableComponentComponent,
    MenuListComponent,
    OrderListComponent,
    CreateOrderComponent,
    MakerPageComponent,
    QueueComponent,
    CashierPageComponent,
    ReceiptsListComponent,
    StatsPageComponent,
    AdminPageComponent,
    UserManagementComponent,
    TableManagementComponent,
    MenuManagementComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        MatDatepickerModule,
        MatInputModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        NgOptimizedImage
    ],
  providers: [
    {provide: UserHttpService, useClass: UserHttpService},
    {provide: WaiterHttpService, useClass: WaiterHttpService},
    {provide: TablesHttpService, useClass: TablesHttpService},
    {provide: SocketioService, useClass: SocketioService},
    {provide: OrdersHttpService, useClass: OrdersHttpService},
    {provide: MenusHttpService, useClass: MenusHttpService},
    {provide: QueueHttpService, useClass: QueueHttpService},
    {provide: ReceiptsHttpService, useClass: ReceiptsHttpService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
