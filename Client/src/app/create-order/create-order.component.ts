import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Dish} from "../models/Dish";
import {OrdersHttpService} from "../Services/orders-http.service";
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";
import {MenusHttpService} from "../Services/menus-http.service";

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit{
  protected dishOptions : Dish[] = [];
  @Output() orderCreated = new EventEmitter<any>;

  constructor(private os : OrdersHttpService, protected us : UserHttpService, private router: Router, private so : SocketioService,
              private menu : MenusHttpService) {
  }

  ngOnInit(): void {
    this.getAllDishOptions()
  }

  getAllDishOptions() {
    this.menu.getMenus().subscribe({
      next: dishes => this.dishOptions = dishes,
      error : err => console.log(err)
    })
  }

}
