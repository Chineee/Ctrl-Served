import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Queue} from "../models/Queue";

@Injectable()
export class QueueHttpService{
  private url = 'http://localhost:5000/api/v1';
  private options = {
    headers: new HttpHeaders({
      'cache-control':'no-cache',
      'Content-Type': 'application/json',
      'auth-token': this.us.getToken()
    })
  }

  private mapper : any = {Cook:"foodqueue", Bartender:"drinkqueue"};

  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  getQueue(role:string) {
    return this.http.get<Queue[]>(this.url+"/" + this.mapper[role], this.options);
  }

  putQueue(id:string, role:string) : Observable<any>{
      return this.http.put(this.url+"/"+this.mapper[role]+"/"+id, {}, this.options);
  }
}

