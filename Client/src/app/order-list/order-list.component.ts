import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../models/Table";
import {TablesHttpService} from "../Services/tables-http.service";
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";
import {Order} from "../models/Order";
import {OrdersHttpService} from "../Services/orders-http.service";
import {Dish} from "../models/Dish";
import {MenusHttpService} from "../Services/menus-http.service";
import {KeyValue} from "@angular/common";

interface Popup {
  showed: boolean,
  type ?: string | null,
  orderNumber ?: number,
  dishesQuantity ?: any
  selections ?: Array<object>,
  tableNumber ?: number
}

enum Error {
  TABLE_ERROR,
  QUANTITY_ERROR,
  DISH_ERROR,
  MISS_FIELD_ERROR
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{
  @Input() tables : Table[] = [];
  @Input() orderDishes : Order[] = []; //single orders
  protected dishOptions : Dish[] = [];
  protected popup : Popup = {showed: false, type: null}
  protected orderGroup: any = {} //all order grouped by their order number associated to their table
  protected dishesQuantity : any = {};
  protected readyOrder : any = {}
  protected selectionDish : Array<string> = [];
  protected selectionQuantity : Array<number> = [];
  protected selectionSize : number = 1;
  protected error : {type: Error | undefined} = {type: undefined}


  constructor(private os : OrdersHttpService, protected us : UserHttpService, private router: Router, private so : SocketioService,
              private menu : MenusHttpService) {
  }
  ngOnInit() {
    this.getAllDishOptions();
    // this.showOrdersNumber();
  }

  showOrdersNumber() {
    const orders : any = {}
    const ready : any = {};

    for (const order of this.orderDishes) {
      if (orders[order.orderNumber] === undefined) orders[order.orderNumber] = order.tableNumber;
      if (this.readyOrder[order.orderNumber] === undefined) {
        //todo understand why this works
        const readyOrders = this.orderDishes.filter( (order2) => order2.orderNumber === order.orderNumber && order2.ready).length;
        const ordersTotal = this.orderDishes.filter( (order2) => order2.orderNumber === order.orderNumber).length;
        if (readyOrders === ordersTotal) {
          this.readyOrder[order.orderNumber] = true;
        } else {
          this.readyOrder[order.orderNumber] = false;
        }
      }
    }
    
    this.orderGroup = orders;
    // this.readyOrder = ready;

    return this.orderGroup;
  }

  isReady(orderNumber: any) {
    return this.readyOrder[orderNumber];
  }

  closePopup() {
    this.dishesQuantity = {};
    this.selectionQuantity = [];
    this.selectionSize = 1;
    this.selectionDish = [];
    this.popup = {showed: false, dishesQuantity: {}, orderNumber: 0}
  }

  deleteSelection(index: number) {
    if (this.selectionSize === 1) return;
    this.selectionQuantity.splice(index, 1);
    this.selectionDish.splice(index, 1);
    this.selectionSize = this.selectionSize - 1;
  }

  confirmPopup() {
    if (this.selectionQuantity.length !== this.selectionDish.length ||
      this.selectionQuantity.filter( (num) => num <= 0 ).length > 0 ||
      this.selectionQuantity.length !== this.selectionSize ||
    this.popup.tableNumber === undefined) {
      this.error = {type: Error.MISS_FIELD_ERROR}
    }
    else {
      //todo qua poi faremo una richiesta:
      const foods : any = {};
      const drinks : any = {};
      for (let index = 0; index < this.selectionSize; index++) {
        const tuple = this.selectionDish[index].split(',');
        const type = tuple[1];
        const dishId = tuple[0];
        if (type === 'Food') {
          if (foods[dishId] === undefined) foods[dishId] = 0;
          foods[dishId] += this.selectionQuantity[index];
        }
        else {
          if (drinks[dishId] === undefined) drinks[dishId] = 0;
          drinks[dishId] += this.selectionQuantity[index];
        }
      }

      const foodsSent = {tableNumber: this.popup.tableNumber, type: 'Foods', dishDict: foods}
      const drinkSent = {tableNumber: this.popup.tableNumber, type: 'Drinks', dishDict: drinks}

      this.createOrder(foodsSent, drinkSent);
      this.closePopup();

    }
  }

  addSelection() {
    this.selectionSize = this.selectionSize + 1;
  }

  createOrder(foods: any, drinks: any) {
    if (Object.keys(foods.dishDict).length !== 0) {
      this.os.createOrder(foods).subscribe({
        next: (data) => {

        },
        error: (err) => this.us.logout()
      });
    }

    if (Object.keys(drinks.dishDict).length !== 0) {
      this.os.createOrder(drinks).subscribe({
        next: (data) => {

        },
        error: (err) => {
          this.us.logout()
        }
      });
    }
  }

  isModifyingSelection(index: number) {

  }

  modifyOrder(event : Event) {
    event.stopPropagation();
    this.popup = {showed: true, type:"MODIFY"}
  }

  getDishQuantity(dishes : any, name : any) {

  }

  getAllDishOptions() {
    this.menu.getMenus().subscribe({
      next: dishes => this.dishOptions = dishes,
      error : err => console.log(err)
    })
  }

  addOrderPopup(){
    const selections = [...this.dishOptions]
    this.popup = {showed: true, type:"ADD", selections: []}
  }

  showOrderPopup(key : any){
    const dishesOrderNumber = this.orderDishes.filter( (order) => order.orderNumber == key);
    for(const orderDish of dishesOrderNumber){
      if (this.dishesQuantity[orderDish.dish.name] === undefined) this.dishesQuantity[orderDish.dish.name] = 1;
      else this.dishesQuantity[orderDish.dish.name] += 1;
    }

    this.popup = {showed: true, dishesQuantity: this.dishesQuantity, orderNumber: key, type: "INFO"}
  }
}


