import {Component, OnInit} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {Table} from "../models/Table";
import {TablesHttpService} from "../Services/tables-http.service";
import {Order} from "../models/Order";
import {OrdersHttpService} from "../Services/orders-http.service";
import {ReceiptsHttpService} from "../Services/receipts-http.service";
import Receipt from "../models/Receipt";
import {SocketioService} from "../Services/socketio.service";

@Component({
  selector: 'app-cashier-page',
  templateUrl: './cashier-page.component.html',
  styleUrls: ['./cashier-page.component.css']
})
export class CashierPageComponent implements OnInit{
  protected tables : Table[] = [];
  protected orders : Order[] = [];
  protected receipts : Receipt[] = []
  constructor(private us : UserHttpService, private router : Router, private ts : TablesHttpService, private os : OrdersHttpService, private receipt : ReceiptsHttpService, private so : SocketioService) {
  }
  ngOnInit(): void {
    if (this.us.getToken() === '') this.router.navigate(['/login'])
    this.getTables()
    this.getOrders();
    this.getReceipts();
    this.so.connect().subscribe({
      next: (data) => {
        this.getReceipts();
        this.getOrders();
        this.getTables();
      }
    })
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/login'])
  }

  getTables() {
    this.ts.getTables().subscribe({
      next: (data) => this.tables = data,
      error: (err) => console.log(err)
    })
  }

  getOrders() {
    this.os.getOrders().subscribe({
      next: (data) => this.orders = data.filter((order) => order.orderNumber !== -1),
      error: (err) => console.log(err)
    })
  }

  getReceipts() {
    this.receipt.getReceipts().subscribe({
      next: (data) => {
        this.receipts = data
      },
      error: (err) => console.log(err)
    })
  }

  createReceipt(event : any){
    this.receipt.createReceipt(event).subscribe({
      next: (data) => {
        this.getTables();
        this.getOrders()
      },
      error: (err) => console.log(err)
    })
  }

}
