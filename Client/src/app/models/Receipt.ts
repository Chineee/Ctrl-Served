import {Dish} from "./Dish";
import User from "./User";
import {Time} from "@angular/common";

export default interface Receipt {
  tableNumber : number,
  dishes : Dish[],
  waiterId : User,
  price: number,
  date: Date,
  hour : Time
}
