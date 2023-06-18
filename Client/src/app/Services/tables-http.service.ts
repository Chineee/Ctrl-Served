import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Table} from "../models/Table";
import {URL} from "../Variables";


@Injectable()
export class TablesHttpService{
  // private url = 'http://localhost:5000/api/v1/tables';
  private url : string = URL+"/tables";
  constructor(private http: HttpClient, private user : UserHttpService) {
  }

  getTables() : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<Table[]>(this.url, options);
  }

  modifyTable(tableNumber: string, occupied: boolean, customers: number) : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    const body = {
      new_occupied: occupied,
      new_customers: customers
    }

    return this.http.put(this.url + "/" + tableNumber.toString(), body, options);
  }

  createTable(obj : any) : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control':'no-cache',
        'Content-type': 'application/json'
      })
    }

    const body : {tableNumber: number, seats: number} = obj;
    return this.http.post(this.url, body, options);
  }

  deleteTable(_id: string) {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control': 'no-cache',
        'Content-type': 'application/json'
      })
    }
    
    return this.http.delete(`${this.url}/${_id}`, options);
  }

  modifyTableSeats(tableNumber: number, seats: number) : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control': 'no-cache',
        'Content-type': 'application/json'
      })
    }
    return this.http.put(`${this.url}/${tableNumber}`, {new_seats: seats}, options);
  }
}

