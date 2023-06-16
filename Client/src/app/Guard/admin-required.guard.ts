import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {UserHttpService} from "../Services/user-http.service";

@Injectable({
  providedIn: 'root'
})
export class AdminRequiredGuard {
  constructor(private us : UserHttpService, private router : Router) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<Boolean | UrlTree> | boolean | UrlTree {
    if (!this.us.hasRole('Admin')) {
      this.router.navigate(['/login'])
      return false;
    }
    return true;
  }
}
