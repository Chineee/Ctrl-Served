import {Dish} from "./Dish";

export interface Queue {
  order: string,
  dish: Dish,
  begin: boolean,
  end: boolean,
  orderNumber: number,
  makerId : string | null
}
