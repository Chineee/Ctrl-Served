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
  constructor(private us : UserHttpService, private router : Router, private elementRef : ElementRef) {
  }
  ngOnInit(): void {
    if (!this.us.hasRole('Admin')) {
      this.router.navigate(['/test'])
      console.log("OK")
    }
  }

  register(name: string, surname: string, email: string, password: string, role: string) {
    this.us.register(name, surname, email, password, role).subscribe({
      next: () => {
        this.router.navigate(['/test'])
      },
      error: (err) => {
        this.errorMessage = err.error;
      }
    })
  }

}
