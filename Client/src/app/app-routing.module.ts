import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {TestComponent} from "./test/test.component";
import {RegisterPageComponent} from "./register-page/register-page.component";

const routes: Routes = [
  {path:'', redirectTo:'/login', pathMatch:'full'},
  {path:'login', component:LoginPageComponent},
  {path: 'test', component:TestComponent},
  {path: 'register', component: RegisterPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
