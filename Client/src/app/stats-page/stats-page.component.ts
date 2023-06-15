import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import User from "../models/User";

enum Role {
  WAITER,
  COOK ,
  CASHIER,
  BARTENDER,
}

enum Stats {
  ROLE,
  DISHES,
  PROFITS
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
  private mapper_role_x = {0: "Waiter", 1: "Cook", 2:"Cashier", 3:"Bartender"}
  private mapper_role_y = {0: ["Dishes served", "Customers served", "Tables served"], 1: "Dishes prepared", 2: "Receipts made", 3:"Drinks prepared"}
  @Input() statsUserRole : any;
  @Input() statsFoods: any;
  @Input() statsDrinks: any;
  @Input() statsProfitMonth: any;
  @Input() statsProfitYear : any;
  @Output() set_last_year = new EventEmitter<number>
  private MAX_LASTS_YEAR = 25;
  private MIN_LASTS_YEAR = 2;

  protected verticalBarOptions : any = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showGridLines: true,
    barPadding: "25",
    showXAxisLabel: true,
    showYAxisLabel: true,
    yAxisLabel: this.mapper_role_y[0],
    xAxisLabel: "Waiter",
    rotateXAxisTicks: true,
    wrapTicks: true,
    yearProfit: 'Year',
    barYearPadding: "9"
  };

  protected readonly Stats = Stats
  protected currentStatsPage : Stats = Stats.ROLE

  constructor(protected us : UserHttpService, private router : Router) {

  }
  ngOnInit() {
    if (this.us.getToken() === '') this.router.navigate(['/login'])
    else if (!this.us.hasRole('Cashier')) this.router.navigate(["/test"])
  }

  buildStatsRole(role : Role)  {
    console.log(this.statsUserRole)
    this.verticalBarOptions.yAxisLabel = this.mapper_role_y[role];
    this.verticalBarOptions.xAxisLabel = this.mapper_role_x[role];
    this.pageRole = role;
    this.currentStatsPage = Stats.ROLE
  }

  buildOtherStats(page : Stats) {
    this.verticalBarOptions.xAxisLabel = "Month"
    this.verticalBarOptions.yAxisLabel = "Profits"
    this.currentStatsPage = page;
  }

  setLastsYear(value : any) {
    value = Math.min(Math.max(value.target.value, this.MIN_LASTS_YEAR), this.MAX_LASTS_YEAR);
    this.verticalBarOptions.barYearPadding = (value/5).toString()

    this.set_last_year.emit(value);
  }
}
