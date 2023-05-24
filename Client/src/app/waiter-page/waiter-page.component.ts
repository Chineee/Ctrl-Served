import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserHttpService} from "../Services/user-http.service";
import {WaiterHttpService} from "../Services/waiters-http.service";
import {Router} from "@angular/router";
import {Table} from "../models/Table";
import {TablesHttpService} from "../Services/tables-http.service";
import {SocketioService} from "../Services/socketio.service";

@Component({
  selector: 'app-waiter-page',
  templateUrl: './waiter-page.component.html',
  styleUrls: ['./waiter-page.component.css']
})
export class WaiterPageComponent implements OnInit{

  public tables : Table[] = []
  constructor(private ts : TablesHttpService, private us : UserHttpService, private router: Router, private so : SocketioService) {
  }

  ngOnInit() {
    if (!this.checkRole()) {
      this.router.navigate(['/test'])
    }else {
      console.log("test")
      this.getTables();
        this.so.connect().subscribe( (m) => {
          this.getTables();
        })
    }
  }

  checkRole() {
    return this.us.hasRole("Waiter");
  }

  getTables() {
    console.log("ENTROOOOOOOOOOOOOOOO nel buco")
    this.ts.getTables().subscribe({
      next: (data) => {
        this.tables = data
      },
      error: () => console.log("errore")/*this.logout()*/
    })

  }

  logout() {
    this.us.logout();
    this.router.navigate(['/login'])
  }



}
