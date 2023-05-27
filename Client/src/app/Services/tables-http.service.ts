import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Table} from "../models/Table";


@Injectable()
export class TablesHttpService{
  private url = 'http://localhost:5000/api/v1/tables';
  constructor(private http: HttpClient, private user : UserHttpService) {
  }

  getTables() : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
        'auth-token': this.user.getToken()
      })
    }

    return this.http.get<Table[]>(this.url, options);
  }

  modifyTable(tableNumber: string, occupied: boolean, customers: number) : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
        'auth-token': this.user.getToken()
      })
    }

    const body = {
      new_occupied: occupied,
      new_customers: customers
    }

    return this.http.put(this.url + "/" + tableNumber.toString(), body, options);
  }
}

