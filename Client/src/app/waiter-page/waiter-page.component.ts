import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserHttpService} from "../Services/user-http.service";
import {WaiterHttpService} from "../Services/waiters-http.service";
import {Router} from "@angular/router";
import {Table} from "../models/Table";
import {TablesHttpService} from "../Services/tables-http.service";
import {SocketioService} from "../Services/socketio.service";
import {Order} from "../models/Order";
import {OrdersHttpService} from "../Services/orders-http.service";

export enum Page {
  TABLES,
  ORDERS,
  CREATE_ORDER
}

@Component({
  selector: 'app-waiter-page',
  templateUrl: './waiter-page.component.html',
  styleUrls: ['./waiter-page.component.css']
})
export class WaiterPageComponent implements OnInit{

  public tables : Table[] = []
  public orders: Order[] = [];
  public page : Page = Page.TABLES;
  protected Page = Page;
  constructor(private ts : TablesHttpService, private us : UserHttpService, private router: Router, private so : SocketioService, private os : OrdersHttpService) {
  }

  ngOnInit() {
    if (!this.us.hasRole("Waiter")) {
      this.router.navigate(['/test'])
    }else {
      this.getTables();
      this.getOrders();
        this.so.connect().subscribe( (m) => {
          if (m === 'table') this.getTables();
          else this.getOrders();
        })
    }
  }


  // sortOrder(orders: Order[]) : Order[] {
  //   return orders.sort( (o1 : Order,o2: Order) => {
  //     if (o1.ready === o2.ready) return 0;
  //     if (o1.ready) return -1;
  //     return 1;
  //   })
  // }
  getOrders() {
    this.os.getWaiterOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => console.log(err)
    })
  }

  showOccupiedTables() {

  }
  getTables() {
    this.ts.getTables().subscribe({
      next: (data) => {
        this.tables = data
      },
      error: (err) => {
        console.log("ERRORE QUA ")
        console.log(err);
        this.logout()
      }
    })

  }

  modifyTable(obj:any) {
    // console.log(obj);
    this.ts.modifyTable(obj.tableNumber, obj.occupied, obj.customers).subscribe({
      next: () => this.getTables(),
      error: (error)  => console.log(JSON.stringify(error))
    })
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/login'])
  }

  changePage() {
    if (this.page === Page.ORDERS) this.page = Page.TABLES;
    else this.page = Page.ORDERS;
  }

  filterWaiterTable() {
    return this.tables.filter((table) => table.waiterId?.email === this.us.getEmail());
  }
}
