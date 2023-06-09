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

  modifyOrderNumber(orderNumber: number) {

    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    return this.http.put(this.url+'/orders?orderNumber='+orderNumber, {}, options);
  }

  deleteOrder(id:string) {

    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    return this.http.delete(this.url+"/orders/"+id, options);
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

  createOrder(obj: any, orderNumber:number|undefined, modified:boolean) {

    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    if (!modified) return this.http.post(this.url+"/orders", obj, options);
    else return this.http.post(this.url+"/orders?orderNumber="+orderNumber, obj, options);
  }

  getWaiterOrders() {

    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    return this.http.get<Order[]>(this.url+"/users/waiters/"+this.us.getId()+"/orders", options);
  }

  getOrdersByOrderNumber(orderNumber: number) : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    return this.http.get<Order[]>(this.url+"/orders?orderNumber=" + orderNumber, options).pipe((tap((data)=>{})));
  }

}

