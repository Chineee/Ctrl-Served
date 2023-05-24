import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Table} from "../models/Table";

// interface TokenData {
//   name:string,
//   email: string,
//   role: string,
//   id: string
// }


@Injectable()
export class TablesHttpService{
  private url = 'http://host.docker.internal:5000/api/v1/tables';
  constructor(private http: HttpClient, private user : UserHttpService) {
  }

  getTables() : Observable<any> {

    console.log(this.user.getToken());
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
        'auth-token': this.user.getToken()
      })
    }

    return this.http.get<Table[]>(this.url, options);
  }
}

