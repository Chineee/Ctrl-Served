import {Component, Input, OnInit} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import User from "../models/User";
import {Chart} from 'chart.js';

enum Role {
  WAITER,
  COOK,
  CASHIER,
  BARTENDER
}

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.css']
})
export class StatsPageComponent implements OnInit{

  protected Role = Role;
  @Input() users : User[] = [];
  protected usersStats = {};

  constructor(protected us : UserHttpService, private router : Router) {
  }
  ngOnInit() {
    if (this.us.getToken() === '') this.router.navigate(['/login'])
    else if (!this.us.hasRole('Cashier')) this.router.navigate(["/test"])
  }

  showStats(role : Role) {

  }
}
