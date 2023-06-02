import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Table} from "../models/Table";
import {Order} from "../models/Order";
import {Queue} from "../models/Queue";


// interface TokenData {
//   name:string,
//   email: string,
//   role: string,
//   id: string
// }


@Injectable()
export class QueueHttpService{
  private url = 'http://host.docker.internal:5000/api/v1';
  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  getQueue() {
    const options = {
      headers: new HttpHeaders({
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
        'auth-token': this.us.getToken()
      })
    }

    return this.http.get<Queue[]>(this.url+"/foodqueue", options);
  }
}

