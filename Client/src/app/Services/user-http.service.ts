import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwtdecode from "jwt-decode";
import {URL} from "../Variables"
import User from "../models/User";


interface LoginResponse {
  access_token: string,
  refresh_token: string
}

@Injectable()
export class UserHttpService {

  // public url : string = 'http://localhost:5000/api/v1';
  // public url : string = 'http://192.168.51.91:5000/api/v1'
  public url : string = URL;
  protected token : string = '';
  private _adminRole : string = '';

  GetAdminMakersRole() {
    console.log(this._adminRole);
    return this._adminRole;
  }

  SetAdminMakersRole(role : string) {
    this._adminRole = role;
  }

  constructor(private http: HttpClient ) {
    const token = localStorage.getItem('auth-token');
    if (token) this.token = token as string;
  }

  login(email: string, password: string, remember: boolean) : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( email + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    return this.http.get(this.url + '/login', options).pipe(
      tap( (data) => {
        this.token = (data as LoginResponse).access_token;
        if (remember) {
          localStorage.setItem('auth-token', this.token as string);
        }
    }));

  }

  modifyUser(userObj:any, id: string) : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.put(this.url + '/users/'+id,  userObj, options);
  }

  register(name: string, surname: string, email: string, password: string, role: string) : Observable<any> {
    const body = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      role: role
    }

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.post(this.url + '/users', body, options);
  }

  deleteUser(id:string) : Observable<any>{

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.delete(this.url+'/users'+'/'+id, options);
  }
  getUsers() {

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.token,
        'cache-control':'no-cache',
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<User[]>(this.url + '/users', options);
  }

  getId() : string | null{
    if (this.token) return (jwtdecode(this.token) as User)._id;
    return null;
  }

  getEmail() : string | null{
    if (this.token) return (jwtdecode(this.token) as User).email;
    return null;
  }
  getToken() : string {
    return this.token;
  }

  hasRole(...role: string[]) : boolean{
    if (this.token) {
      const user = jwtdecode(this.token) as User;
      return role.includes(user.role) || user.role === 'Admin';
    }
    return false;

  }

  getRole() : string | null {
    if (this.token) {
      return (jwtdecode(this.token) as User).role;
    }
    return null;
  }
  logout() : void {
    localStorage.setItem('auth-token', '');
    this.token = '';
  }
}
