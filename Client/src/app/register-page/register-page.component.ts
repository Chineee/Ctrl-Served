import {Component, ElementRef, OnInit} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit{

  public errorMessage: string | undefined = undefined;
  public error : boolean = false;
  public success : boolean = false;
  public successMessage: string | undefined = undefined;
  constructor(private us : UserHttpService, private router : Router, private elementRef : ElementRef) {
  }
  ngOnInit(): void {
    if (!this.us.hasRole('Admin')) {
      this.router.navigate(['/login'])
    }
  }

  register(name: string, surname: string, email: string, password: string, role: string) {
    if (role === '') this.errorMessage = "Role required"
    else {
      this.us.register(name, surname, email, password, role).subscribe({
        next: () => {
          this.success = true;
          this.error = false;
          this.errorMessage = undefined;
          this.successMessage = "User ok registrered sium"
        },
        error: (err) => {
          this.success = false;
          this.successMessage = undefined;
          this.errorMessage = err.error;
        }
      })
    }
  }
  
  backToAdmin() {
    this.router.navigate(['/admins'])
  }

  
}
