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
  styleUrls: ['./order-list.component.css'],
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
  protected error : {type: Error | undefined} = {type: undefined};
  protected alert : any = {showed: false, error:false, message:""};
  protected filter_table : number = -1;


  constructor(private os : OrdersHttpService, protected us : UserHttpService, private router: Router, private so : SocketioService,
              private menu : MenusHttpService) {
  }
  ngOnInit() {
    this.getAllDishOptions();
    // this.showOrdersNumber();
  }


  filterTable(event : any) {
    const filter = event.target.value;
    if (filter === '') this.filter_table = -1;
    else this.filter_table = parseInt(filter)
  }

  //groyp all orders in a dictionary with their order number
  showOrdersNumber(filter: number, isReady : boolean) {
    const orders : any = {}
    const ready : any = {};

    const filteredOrder = this.orderDishes.filter( (order) => order.tableNumber === filter || filter === -1)

    for (const order of filteredOrder) {
      if (orders[order.orderNumber] === undefined) orders[order.orderNumber] = order.tableNumber;
      if (ready[order.orderNumber] === undefined) {
        //todo understand why this works
        const readyOrders = filteredOrder.filter( (order2) => order2.orderNumber === order.orderNumber && order2.ready).length;
        const ordersTotal = filteredOrder.filter( (order2) => order2.orderNumber === order.orderNumber).length;
        if (readyOrders === ordersTotal) {
          ready[order.orderNumber] = true;
        } else {
          ready[order.orderNumber] = false;
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

  deleteOrderSelection(key : unknown) {
    const cpy= this.dishesQuantity;
    delete cpy[key as string];
    this.dishesQuantity = cpy;
  }

  cannotCloseConfirm() {
    if (this.selectionQuantity.length !== this.selectionDish.length ||
      this.selectionQuantity.filter( (num) => num <= 0 ).length > 0 ||
      this.selectionQuantity.length !== this.selectionSize ||
      this.popup.tableNumber === undefined) {
        return true;
    }
    return false;
  }

  confirmPopup() {
    if (this.cannotCloseConfirm()) this.error = {type: Error.MISS_FIELD_ERROR}
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

  decreaseQuantity(selection_key: unknown, select_value: unknown) {
    let copy : any = {}
    Object.keys(this.dishesQuantity).forEach((key, index) => {

      if (key === selection_key) copy[key as string] = select_value as number - 1 <= 1 ? 1 : select_value as number - 1;
      else copy[key as string] = this.dishesQuantity[key];

    });
    this.dishesQuantity = copy;
    console.log(this.dishesQuantity)
  }

  getDishQuantityByKey(key : unknown) {
    return this.dishesQuantity[key as string];
  }

  increaseQuantity(selection_key : unknown, selection_value : unknown) {
    let copy : any = {}
    Object.keys(this.dishesQuantity).forEach((key, index) => {
      if (key === selection_key) copy[key as string] = selection_value as number + 1
      else copy[key as string] = this.dishesQuantity[key];
    });
    this.dishesQuantity = copy;
  }

  createOrder(foods: any, drinks: any) {
    if (Object.keys(foods.dishDict).length !== 0) {
      this.os.createOrder(foods, undefined, false).subscribe({
        next: (data) => {

        },
        error: (err) => this.us.logout()
      });
    }

    if (Object.keys(drinks.dishDict).length !== 0) {
      this.os.createOrder(drinks, undefined, false).subscribe({
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

  modifyOrder(event : Event, dish_key: unknown) {
    event.stopPropagation();
    this.setUpDishesQuantity(dish_key)
    console.log(this.dishesQuantity);
    this.popup = {showed: true, type:"MODIFY", tableNumber: this.orderGroup[dish_key as string], dishesQuantity: this.dishesQuantity, orderNumber: dish_key as number};
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
    this.setUpDishesQuantity(key);
    this.popup = {showed: true, dishesQuantity: this.dishesQuantity, orderNumber: key, type: "INFO"}
  }

  private setUpDishesQuantity(key : any) : any {
    const dishesOrderNumber = this.orderDishes.filter( (order) => order.orderNumber == key);
    for(const orderDish of dishesOrderNumber){
      if (this.dishesQuantity[orderDish.dish.name] === undefined) this.dishesQuantity[orderDish.dish.name] = 1;
      else this.dishesQuantity[orderDish.dish.name] += 1;
    }
  }

  confirmDelivery(orderNumber: number | undefined) {
    this.os.modifyOrderNumber(orderNumber as number).subscribe({
      next: (data) => {
        console.log("HELP i'M DYiNG")
      },
      error: (err) => console.log(err)
    })
  }

  confirmModification(orderNumber: unknown) {
    console.log(this.dishesQuantity);
    this.os.getOrdersByOrderNumber(orderNumber as number).subscribe({
      next: (data) => {
        const oldQuantity : any = {};
        let success : boolean = true;
        for(let order of data){
          if(order.ready) {
            success = false;
            break;
          }
          if(oldQuantity[order.dish.name] === undefined ) oldQuantity[order.dish.name] = [1, [order._id], order.dish._id, order.dish.type];
          else {
            oldQuantity[order.dish.name][0] += 1;
            oldQuantity[order.dish.name][1].push(order._id);
          }
        }
        console.log(success)
        if (success) {
          const order : any = {
            tableNumber: this.popup.tableNumber,
            dishDict: {},
            type: data[0].dish.type + "s"
          }
          for(let key of Object.keys(oldQuantity)){
            if(this.dishesQuantity[key] === undefined) {
              for (let o of oldQuantity[key][1]) {
                this.os.deleteOrder(o).subscribe({});
              }
            }
            else if(this.dishesQuantity[key] > oldQuantity[key][0]){
              const toAdd = this.dishesQuantity[key] - oldQuantity[key][0];

              order.dishDict[oldQuantity[key][2]] = toAdd;
            }
            else if (this.dishesQuantity[key] < oldQuantity[key][0]) {
              const toDelete = oldQuantity[key][0] - this.dishesQuantity[key];

              for (let i = 0; i < toDelete; i++) {
                this.os.deleteOrder(oldQuantity[key][1][i]).subscribe({})
              }

            }
          }
          this.os.createOrder(order, orderNumber as number, true).subscribe({
            next: (data) => {},
            error: (err) => {
              this.alert = {showed: true, error: true, message:err.message}
            }
          });
          this.alert = {showed: true, error: false, message:"Order modified successfully"}

        } else {
          this.alert = {showed: true, error: true, message:"You cannot modify this order!"}
        }

        this.closePopup();

      },
      error: (err) => {
        if (err.errorMessage === 'You must be logged') this.logout()
      }
    });

    return 0;
  }

  logout() {
    this.so.disconnect();
    this.us.logout();
  }

  protected readonly undefined = undefined;
}


