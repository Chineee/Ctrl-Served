import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Table} from "../models/Table";
import {URL} from "../Variables";
import Receipt from "../models/Receipt";


@Injectable()
export class ReceiptsHttpService {
  // private url = 'http://localhost:5000/api/v1/tables';
  private url : string = URL+"/receipts";

  constructor(private http: HttpClient, private user : UserHttpService) {
  }

  createReceipt(tableNumber : number) : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.post(this.url, {tableNumber: tableNumber}, options).pipe(tap((data)=>console.log(data)));
  }

  getReceipts() : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.user.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<Receipt[]>(this.url, options);
  }

}

