import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwtdecode from "jwt-decode";
import {UserHttpService} from "./user-http.service";

// interface TokenData {
//   name:string,
//   email: string,
//   role: string,
//   id: string
// }


@Injectable()
export class WaiterHttpService extends UserHttpService{

  getWaiters() {

  }

}

