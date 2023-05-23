import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwtdecode from "jwt-decode";


interface TokenData {
  name:string,
  email: string,
  role: string,
  id: string
}

interface LoginResponse {
  accessToken: string,
  refreshToken: string
}

@Injectable()
export class UserHttpService {

  private url : string = 'http://host.docker.internal:5000/api/v1';
  private token : string = '';

  constructor( private http: HttpClient ) {
    console.log('User service instantiated');

  }
  login(email: string, password: string, remember: boolean) : Observable<any> {

    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa( email + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      })
    };

    return this.http.get(this.url + '/login', options).pipe(tap( (data) => {
      console.log(data);
      this.token = (data as LoginResponse).accessToken;
      if (remember) {
        localStorage.setItem('auth-token', this.token);
      }
    }));

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
}
