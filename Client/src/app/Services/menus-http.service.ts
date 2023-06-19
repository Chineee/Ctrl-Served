import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Order} from "../models/Order";
import {URL} from "../Variables";
import {Dish} from "../models/Dish"

@Injectable()
export class MenusHttpService{
  // private url = 'http://localhost:5000/api/v1/menu';
  private url : string = URL +'/menu'
  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  getMenus() : Observable<any>{
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }
    //todo options
    return this.http.get(this.url, options);
  }

  addDish(dish : any) : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.url, dish, options);
  }

  deleteDish(id ?: string) : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.delete(`${this.url}/${id}`, options);
  }

  modifyDish(id ?: string, new_price ?: number) : Observable<any> {
    const body = {
      new_price: new_price
    };

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.put(`${this.url}/${id}`, body, options);

  }


}

