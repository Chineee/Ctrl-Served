import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {TestComponent} from "./test/test.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {AdminRequiredGuard} from "./Guard/admin-required.guard";
import {WaiterPageComponent} from "./waiter-page/waiter-page.component";
import {QueueHttpService} from "./Services/queue-http.service";
import {MakerPageComponent} from "./makers-page/makers-page.component";
import {CashierPageComponent} from "./cashier-page/cashier-page.component";

const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'login', component:LoginPageComponent},
  {path: 'test', component:TestComponent},
  {path: 'register', component: RegisterPageComponent, canActivate: [AdminRequiredGuard]},
  {path: 'waiters', component: WaiterPageComponent},
  {path: 'makers', component: MakerPageComponent},
  {path: 'cashiers', component: CashierPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
