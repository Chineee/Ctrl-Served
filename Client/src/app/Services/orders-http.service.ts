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
  private options = {
    headers: new HttpHeaders({
      'cache-control':'no-cache',
      'Content-Type': 'application/json',
      'auth-token': this.us.getToken()
    })
  }
  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  modifyOrderNumber(orderNumber: number) {
    return this.http.put(this.url+'/orders?orderNumber='+orderNumber, {}, this.options);
  }

  deleteOrder(id:string) {
    return this.http.delete(this.url+"/orders/"+id, this.options);
  }

  getOrders() {
    return this.http.get<Order[]>(this.url+"/orders", this.options);
  }

  createOrder(obj: any, orderNumber:number|undefined, modified:boolean) {
    if (!modified) return this.http.post(this.url+"/orders", obj, this.options);
    else return this.http.post(this.url+"/orders?orderNumber="+orderNumber, obj, this.options);
  }

  getWaiterOrders() {
    return this.http.get<Order[]>(this.url+"/users/waiters/"+this.us.getId()+"/orders", this.options);
  }

  getOrdersByOrderNumber(orderNumber: number) : Observable<any> {
    return this.http.get<Order[]>(this.url+"/orders?orderNumber=" + orderNumber, this.options).pipe((tap((data)=>{})));
  }

}

