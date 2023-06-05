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
  private url = 'http://localhost:5000/api/v1';
  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  getOrders() {
    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }
    return this.http.get<Order[]>(this.url+"/orders", options);
  }

  createOrder(obj: any) {
    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    return this.http.post(this.url+"/orders", obj, options);
  }

  getWaiterOrders() {
    const options = {
      headers: new HttpHeaders({
          'cache-control': 'no-cache',
          'Content-Type':  'application/json',
          "auth-token": this.us.getToken()
        }
      )
    }

    return this.http.get<Order[]>(this.url+"/users/waiters/"+this.us.getId()+"/orders", options).pipe(tap(
      (data) => console.log("riuscito", data)
    ));
  }

}

