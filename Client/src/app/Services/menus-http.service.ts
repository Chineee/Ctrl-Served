import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Order} from "../models/Order";

@Injectable()
export class MenusHttpService{
  private url = 'http://host.docker.internal:5000/api/v1/menu';
  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  getMenus() : Observable<any>{
    //todo options
    return this.http.get(this.url);
  }


}

