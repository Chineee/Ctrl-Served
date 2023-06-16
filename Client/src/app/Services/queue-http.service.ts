import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {UserHttpService} from "./user-http.service";
import {Queue} from "../models/Queue";
import {URL} from "../Variables";

@Injectable()
export class QueueHttpService{
  private url = URL

  private mapper : any = {Cook:"foodqueue", Bartender:"drinkqueue", Admin: this.us.GetAdminMakersRole()};

  constructor(private http: HttpClient, private us : UserHttpService) {
  }

  getQueue(role:string) {

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    if (role === 'Admin') this.mapper[role]=this.us.GetAdminMakersRole();

    return this.http.get<Queue[]>(this.url+"/" + this.mapper[role], options);
  }

  putQueue(id:string, role:string) : Observable<any>{
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }
    return this.http.put(this.url+"/"+this.mapper[role]+"/"+id, {}, options);
  }

  deleteFromQueue(id: string, role:string) : Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }
    return this.http.delete(this.url+'/'+this.mapper[role]+'/'+id, options)
  }
}

