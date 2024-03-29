import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserHttpService} from "../Services/user-http.service";
import {HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  protected errorMessage : any = undefined;
  protected error : boolean = false;
  constructor(protected us: UserHttpService, private router: Router, private elementRef : ElementRef) {
  }

  ngOnInit(): void {
    this.goToPageRole();
  }


  goToPageRole() {
    const role = this.us.getRole() as string;
    if (role) {
      if (!['Bartender', 'Cook'].includes(role)) this.router.navigate(['/'+role.toLowerCase()+'s'])
      else {
        this.router.navigate(['/makers'])
      }
    } 
  }


  login(email: string, password: string, rememberMe: boolean) {
    this.us.login(email, password, rememberMe).subscribe({
      next: (data) => {
        this.goToPageRole();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.message;
      }
    })
  }

  hasRole(...role : string[]) : boolean {
    return this.us.hasRole(...role)
  }
  register(name : string, surname : string, email : string, password : string, role : string) {

  }
}
