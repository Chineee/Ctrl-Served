import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {HttpClientModule} from "@angular/common/http";
import {UserHttpService} from "./user-http.service";
import { TestComponent } from './test/test.component';
import { RegisterPageComponent } from './register-page/register-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    TestComponent,
    RegisterPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: UserHttpService, useClass: UserHttpService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
