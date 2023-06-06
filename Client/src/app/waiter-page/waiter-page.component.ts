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
import {MenusHttpService} from "../Services/menus-http.service";
import {GroupOrderReady} from "../models/Table"

export enum Page {
  TABLES,
  ORDERS,
  CREATE_ORDER
}

@Component({
  selector: 'app-waiter-page',
  templateUrl: './waiter-page.component.html',
  styleUrls: ['./waiter-page.component.css'],
})
export class WaiterPageComponent implements OnInit{

  public tables : Table[] = []
  public orders: Order[] = [];
  public page : Page = Page.TABLES;
  protected Page = Page;
  public oneOrderReady : boolean = false;
  constructor(private ts : TablesHttpService, private us : UserHttpService, private router: Router, private so : SocketioService, private os : OrdersHttpService) {
  }

  ngOnInit() {
    if (!this.us.hasRole("Waiter")) {
      this.router.navigate(['/login'])
    }else {
      this.getTables();
      this.getOrders();
        this.so.connect().subscribe( (m) => {
          this.getTables();
          this.getOrders();
        })
    }
  }

  getStringOrder() {
    if (this.page === Page.TABLES) {
      for (let i = 0; i < this.tables.length; i++) {
        if (GroupOrderReady(this.tables[i].tableNumber, this.orders)) return "Show order (one order ready)"
      }
      return "Show order"
    }
    return "Show tables"
  }

  //todo spostare questa funzione dentro l'interfaccia TABLE
  // groupOrderReady(tableNumber: number)  : boolean {
  //   // const tableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber);
  //   // const readyTableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber && order.ready);
  //   // return tableOrder.length === readyTableOrder.length && tableOrder.length !== 0
  //   let res = false;
  //   const dict : any = [];
  //   for (let i = 0; i < this.orders.length; i++) {
  //     if (!dict.includes(this.orders[i].orderNumber)) dict.push(this.orders[i].orderNumber)
  //   }
  //   for (let i = 0; i < dict.length; i++) {
  //     const readyOrderNumber = this.orders.filter((order) => order.orderNumber === dict[i] && order.ready && order.tableNumber === tableNumber);
  //     const ordersNumber = this.orders.filter((order) => order.orderNumber === dict[i] && order.tableNumber === tableNumber);
  //     if (readyOrderNumber.length === ordersNumber.length && ordersNumber.length !== 0) res = true;
  //   }
  //   return res;
  // }

  getOrders() {
    this.os.getWaiterOrders().subscribe({
      next: (data) => {
        this.orders = data.filter((order)=>order.orderNumber !== -1);
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
