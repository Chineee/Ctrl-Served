import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwtdecode from "jwt-decode";


interface TokenData {
  name:string,
  email: string,
  role: string,
  _id: string
}

interface LoginResponse {
  access_token: string,
  refresh_token: string
}

@Injectable()
export class UserHttpService {

  public url : string = 'http://localhost:5000/api/v1';
  protected token : string = '';

  constructor(protected http: HttpClient ) {
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
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
        'auth-token': this.token
      })
    }

    return this.http.post(this.url + '/users', body, options);
  }

  getId() {
    const a = (jwtdecode(this.token) as TokenData);
    console.log("USER ORA === ");
    console.log(a);
    return a._id;
  }

  getEmail() {
    return (jwtdecode(this.token) as TokenData).email;
  }
  getToken() {
    return this.token;
  }

  hasRole(...role: string[]) {
    const user = jwtdecode(this.token) as TokenData;
    return role.includes(user.role) || user.role === 'Admin';

  }

  getRole() {
    return (jwtdecode(this.token) as TokenData).role;
  }

  logout() {
    localStorage.setItem('auth-token', '');
    this.token = '';
  }
}
