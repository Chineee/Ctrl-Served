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


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{
  @Input() tables : Table[] = [];
  @Input() orderDishes : Order[] = []; //single orders
  protected dishOptions : Dish[] = [];
  protected popup : any;
  protected orderGroup: any; //all order grouped by their order number


  constructor(private os : OrdersHttpService, private us : UserHttpService, private router: Router, private so : SocketioService,
              private menu : MenusHttpService) {
  }
  ngOnInit() {
    this.getAllDishOptions();
  }

  showOrdersNumber() {

    let dict : any = {};
    const orderWaiter = this.showOrders();
    for (const order of orderWaiter) {
      if (dict[order.orderNumber] === undefined) dict[order.orderNumber] = {}
      else {
        const dishes = dict[order.orderNumber].dishes;
        if (dishes[order.dish] === undefined) dishes[order.dish] = 0;
        else dishes[order.dish] += 1;
        dict[order.orderNumber] = {"tableNumber": order.tableNumber, "dishes": dishes};
      }
    }

    this.orderGroup = dict;
    return dict;

  }

  showOrders() {
    return this.orderDishes.filter(order => order.waiterId === this.us.getEmail());
  }

  closePopup() {

  }

  deleteSelection(index: number) {

  }
  addSelection() {

  }

  isModifyingSelection(index: number) {

  }

  modifyOrder() {

  }

  getDishQuantity(dishes : any, name : any) {

  }
  getAllDishOptions() {
    this.menu.getMenus().subscribe({
      next: dishes => this.dishOptions = dishes,
      error : err => console.log(err)
    })
  }
}


