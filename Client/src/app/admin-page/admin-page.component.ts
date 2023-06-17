import {Component, OnInit} from '@angular/core';
import User from "../models/User";
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";
import {Dish} from "../models/Dish";
import {Table} from "../models/Table"
import { TablesHttpService } from '../Services/tables-http.service';
import { MenusHttpService } from '../Services/menus-http.service';

enum Page {
  USER,
  TABLE,
  MENU
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  protected users : User[] = [];
  protected menus : Dish[] = [];
  protected tables : Table[] = [];
  protected page : Page = Page.USER;
  protected Page = Page;

  constructor(protected us : UserHttpService, protected router : Router, protected so : SocketioService, protected ts : TablesHttpService, protected ms : MenusHttpService) {}

  ngOnInit() {
    this.loadUsers()
    this.loadTables();
    this.loadMenus();
    this.so.connect().subscribe({
      next: (m:any) => {
        this.loadUsers();
        this.loadTables();
        this.loadMenus();
      }
    });
  }

  loadTables() : void {
    this.ts.getTables().subscribe({
      next: (data) => {
        console.log(data)
        this.tables = data
      },
      error: (err) => console.log(err)
    })
  }
  
  loadMenus() : void {
    this.ms.getMenus().subscribe({
      next: (data) => this.menus = data
    })
  }

  logout() {
    this.so.disconnect();
    this.us.logout();
    this.router.navigate(['/login'])
  }

  loadUsers() : void {
    this.us.getUsers().subscribe({
      next: (data) => this.users = data
    })
  }

  changePage(page : Page) {
    this.page = page;
  }
}
