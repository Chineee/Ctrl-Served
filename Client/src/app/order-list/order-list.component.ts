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


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{
  @Input() tables : Table[] = [];
  @Input() orderDishes : Order[] = []; //single orders
  protected dishOptions : Dish[] = [];
  protected popup : any = {showed: false, type: null}
  protected orderGroup: any; //all order grouped by their order number associated to their table
  protected dishesQuantity : any = {};
  protected readyOrder : any = {}



  constructor(private os : OrdersHttpService, private us : UserHttpService, private router: Router, private so : SocketioService,
              private menu : MenusHttpService) {
  }
  ngOnInit() {
    this.getAllDishOptions();
  }

  showOrdersNumber() {

    const orders : any = {}
    const ready : any = {};
    for (const order of this.orderDishes) {
      if (orders[order.orderNumber] === undefined) orders[order.orderNumber] = order.tableNumber;
      if (ready[order.orderNumber] === undefined) {
        //todo understand why this works
        const readyOrders = this.orderDishes.filter( (order2) => order2.orderNumber === order.orderNumber && order2.ready).length;
        const ordersTotal = this.orderDishes.filter( (order2) => order2.orderNumber === order.orderNumber).length;
        if (readyOrders === ordersTotal) {
          ready[order.orderNumber] = true;
        }
      }
    }

    this.orderGroup = orders;
    this.readyOrder = ready;
    return this.orderGroup;
  }

  isReady(orderNumber: any) {
    return this.readyOrder[orderNumber];
  }

  closePopup() {
    this.dishesQuantity = {};
    this.popup = {showed: false, dishesQuantity: {}, orderNumber: 0}
  }

  deleteSelection(index: number) {

  }
  addSelection() {

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
    this.popup = {showed: true, type:"ADD"}
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


