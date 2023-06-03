import {Dish} from "./Dish";

export interface Queue {
  readonly _id: string
  order: string,
  dish: Dish,
  begin: boolean,
  end: boolean,
  orderNumber: number,
  makerId : string | null
}
