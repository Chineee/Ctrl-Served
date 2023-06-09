import {Component, Input, OnInit} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import User from "../models/User";

enum Role {
  WAITER,
  COOK ,
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
  protected pageRole : Role = Role.WAITER
  @Input() users : User[] = [];
  protected usersStats : {name: string, value:number}[] = [];
  private mapper_role_x = {0: "Waiter", 1: "Cook", 2:"Cashier", 3:"Bartender"}
  private mapper_role_y = {0: "Plates served", 1: "Dishes prepared", 2: "Receipts made", 3:"Drinks prepared"}
  @Input() statsUserRole : any;
  protected verticalBarOptions = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showGridLines: true,
    barPadding: 25,
    showXAxisLabel: true,
    showYAxisLabel: true,
    yAxisLabel: "Plates served",
    xAxisLabel: "Waiter",
    rotateXAxisTicks: true,
    wrapTicks: true
  };

  constructor(protected us : UserHttpService, private router : Router) {

  }
  ngOnInit() {
    if (this.us.getToken() === '') this.router.navigate(['/login'])
    else if (!this.us.hasRole('Cashier')) this.router.navigate(["/test"])
  }

  buildStats(role : Role)  {
    // const usersRole = this.users.filter((user)=> user.role === this.mapper_role_x[role]);
    // const result : {name: string, value: number}[] = []
    // for(const user of usersRole) {
    //   console.log(user);
    //   result.push({name: user.name + ' ' + user.surname, value: user.counter})
    // }
    this.verticalBarOptions.xAxisLabel = this.mapper_role_x[role];
    this.verticalBarOptions.yAxisLabel = this.mapper_role_y[role];
    this.pageRole = role;
    // console.log(this.statsUserRole)
  }


}
