import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Table} from "../models/Table";
import {Order} from "../models/Order";

// interface TokenData {
//   name:string,
//   email: string,
//   role: string,
//   id: string
// }


@Injectable()
export class OrdersHttpService{
  private url = 'http://host.docker.internal:5000/api/v1/tables';
  constructor(private http: HttpClient, private us : UserHttpService) {
  }
  
  getOrders() {
    return this.http.get<Order[]>(this.url);
  }
  
  getWaiterOrders() {
    const email = this.us.getEmail();
    
    return this.http.get<Order[]>(this.url);
  }

}

