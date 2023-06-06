import User from "./User";
import {Order} from "./Order";

export interface Table {
  tableNumber: number,
  seats: number,
  customers: number,
  occupied: boolean,
  waiterId: User
}

export const GroupOrderReady = (tableNumber: number, orders: Order[]) => {
  // const tableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber);
  // const readyTableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber && order.ready);
  // return tableOrder.length === readyTableOrder.length && tableOrder.length !== 0
  let res = false;
  const dict : any = [];
  for (let i = 0; i < orders.length; i++) {
    if (!dict.includes(orders[i].orderNumber)) dict.push(orders[i].orderNumber)
  }
  for (let i = 0; i < dict.length; i++) {
    const readyOrderNumber = orders.filter((order) => order.orderNumber === dict[i] && order.ready && order.tableNumber === tableNumber);
    const ordersNumber = orders.filter((order) => order.orderNumber === dict[i] && order.tableNumber === tableNumber);
    if (readyOrderNumber.length === ordersNumber.length && ordersNumber.length !== 0) res = true;
  }
  return res;
}