import {Component, OnInit, ElementRef} from '@angular/core';
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
  constructor(private ts : TablesHttpService, protected us : UserHttpService, private router: Router, private so : SocketioService, private os : OrdersHttpService, private el : ElementRef) {
    // this.el.nativeElement.ownerDocument.body.className = 'Waiter';
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

  backToAdmin() {
    this.so.disconnect();
    this.router.navigate(['/admins'])
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
    this.so.disconnect()
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
