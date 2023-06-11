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
import User from "../models/User";
import {MenusHttpService} from "../Services/menus-http.service";

enum Page {
  TABLES = "TABLES PAGE",
  ORDERS = "ORDERS PAGE",
  RECEIPTS = "RECEIPTS PAGE",
  STATS = "STATS PAGE"
}

@Component({
  selector: 'app-cashier-page',
  templateUrl: './cashier-page.component.html',
  styleUrls: ['./cashier-page.component.css']
})
export class CashierPageComponent implements OnInit{
  protected tables : Table[] = [];
  protected orders : Order[] = [];
  protected receipts : Receipt[] = [];
  protected users : User[] = []
  protected page : Page = Page.RECEIPTS;
  protected Page = Page;
  protected statsUserRole : any;
  protected popup : {showed: boolean, receipt?: Receipt} = {showed: false};
  protected receiptStatsFoods : {name: string, value: number}[] = [];
  protected receiptStatsDrinks : {name: string, value: number}[] = [];
  protected profitStatsMonth : {name: string, value: number}[] = []
  constructor(private us : UserHttpService, private router : Router, private ts : TablesHttpService, private os : OrdersHttpService, private receipt : ReceiptsHttpService, private so : SocketioService, private menu : MenusHttpService) {
  }
  ngOnInit(): void {
    if (this.us.getToken() === '') this.router.navigate(['/login'])
    this.getTables()
    this.getOrders();
    this.getReceipts();
    this.getUsers();
    this.so.connect().subscribe({
      next: (data) => {
        this.getReceipts();
        this.getOrders();
        this.getTables();
        this.getUsers();
      }
    })
  }


  getDishesStats(receipts : Receipt[]) {
    const month = new Date().toLocaleDateString().split('/')[1];
    const receiptFiltered = receipts.filter((receipt) => {
      return receipt.date.toString().split('/')[1] === month.padStart(2, '0');
    });

    const foods : any = {}
    const drinks : any = {}

    for (const receipt of receiptFiltered) {
      for (const dish of receipt.dishes) {
        if (dish.type === 'Food') {
          if (foods[dish.name] === undefined) foods[dish.name] = 1;
          else foods[dish.name] += 1;

        }
        else {
          if (drinks[dish.name] === undefined) drinks[dish.name] = 1;
          else drinks[dish.name] += 1;
        }
      }
    }
    const suppFoods : {name: string, value: number}[] = [];
    const suppDrinks : {name: string, value: number}[] = [];
    //build foods stats
    for (const key of Object.keys(foods)) {
      suppFoods.push({name: key, value: foods[key]});
    }

    for (const key of Object.keys(drinks)) {
      suppDrinks.push({name: key, value: drinks[key]});
    }

    this.receiptStatsFoods = suppFoods;
    this.receiptStatsDrinks = suppDrinks;
  }

  getUsers() {
    this.us.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.statsUserRole = {
          0: this.buildUserRole("Waiter"),
          1: this.buildUserRole("Cook"),
          2: this.buildUserRole("Cashier"),
          3: this.buildUserRole("Bartender")
        }
      },
      error: (err) => {
        this.logout()
        console.log("sono qua");
      }
    })
  }

  showModal(modal: any) {
    console.log(modal);
  }

  buildUserRole(role: string) {
    const usersRole = this.users.filter((user)=> user.role === role);
    const result : {name: string, value: number}[] = []
    for(const user of usersRole) {
      result.push({name: user.name + ' ' + user.surname, value: user.counter})
    }
    return result;
  }

  changeStatus(newPage : Page) {
    this.page = newPage;
  }

  logout() {
    this.us.logout();
    this.so.disconnect()
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
      next: (data) => this.orders = data,
      error: (err) => console.log(err)
    })
  }

  getReceiptsDataMonth(receipts : Receipt[]){

    let supp : any = [];
    const getMonthName = (monthNumber : number) => {
      const date = new Date();
      date.setMonth(monthNumber - 1);

      return date.toLocaleString('en-US', {
        month: 'long',
      });
    }

    const currentYear = new Date().toLocaleDateString().split('/')[2]
    for (let month = 1; month <= 12; month++) {
      const monthlyReceipt = receipts.filter((receipt)=>{
        const receiptDate = receipt.date.toString().split('/')
        return receiptDate[1] === month.toString().padStart(2, '0') && currentYear === receiptDate[2];
      })
      let price = 0
      for (const receipt of monthlyReceipt) {
        price += receipt.price;
      }

      supp.push({name: getMonthName(month), value: parseFloat(price.toFixed(2))});
    }
    this.profitStatsMonth = supp;

  }

  getReceipts() {
    this.receipt.getReceipts().subscribe({
      next: (data) => {
        this.getDishesStats(data)
        this.getReceiptsDataMonth(data);
        this.receipts = data
      },
      error: (err) => console.log(err)
    })
  }

  showReceiptPopup(receipt : Receipt){

  }

  createReceipt(event : any){
    this.receipt.createReceipt(event).subscribe({
      next: (data) => {
        this.getTables();
        this.getOrders();
        this.showReceiptPopup(data);
        this.popup = {showed:true, receipt:data}
      },
      error: (err) => console.log(err)
    })
  }

  closePopup() {
    this.popup = {showed: false}
  }

}
