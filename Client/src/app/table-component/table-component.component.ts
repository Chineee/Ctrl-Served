import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Type} from '@angular/core';
import {TablesHttpService} from '../Services/tables-http.service';
import {Table} from "../models/Table";
import {UserHttpService} from "../Services/user-http.service";
import {Order} from "../models/Order";

export enum TableStatus {
  ALL,
  FREE,
  OCCUPIED,
  MINE
}

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css']
})

export class TableComponentComponent implements OnInit{

  @Input() public tables : Table[] = [];
  @Input() public orders : Order[] = [];
  @Output() public post = new EventEmitter<any>;
  public filterTables : TableStatus = TableStatus.ALL;
  protected readonly TableStatus = TableStatus;
  protected popup = {showed: false, tableNumber: -1, seats: 0, isWaiter: false, occupied: false, customers: 0}
  protected customers : number = 0;
  protected readonly Array = Array;
  protected isModifyingCustomers: boolean = false;
  protected dictionary : any = {};
  @Output() protected receiptEvent = new EventEmitter<number>;

  constructor(protected us : UserHttpService) {
  }
  //TODO GESTIRE IL GRUPPO DEGLI ORDINI DIRETTAMENTE SULLA PAGINA DI WAITERS E PASSARLO IN INPUT COSÌ PASSIAMO QUA E SAPPIAMO COSA E LIBERO
  ngOnInit(): void {

  }

  showTables() {
    return this.tables.filter((table) => {
      switch (this.filterTables) {
        case TableStatus.OCCUPIED:
          return table.occupied;
        case TableStatus.FREE:
          return !table.occupied;
        case TableStatus.MINE:
          this.dictionary[table.tableNumber] = table.customers;
          return table.occupied && table.waiterId?.email === this.us.getEmail();
      }
      return true;
    })
  }

  //check if ALL orders of a table are ready
  allOrdersReady(tableNumber: number) : boolean {
    const tableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber);
    const readyTableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber && order.ready);
    return tableOrder.length === readyTableOrder.length && tableOrder.length !== 0
  }

  //return true if at least one order is ready for a table
  groupOrderReady(tableNumber: number)  : boolean {
    // const tableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber);
    // const readyTableOrder = this.orders.filter( (order) => order.tableNumber === tableNumber && order.ready);
    // return tableOrder.length === readyTableOrder.length && tableOrder.length !== 0
    let res = false;
    const dict : any = [];
    for (let i = 0; i < this.orders.length; i++) {
      if (!dict.includes(this.orders[i].orderNumber)) dict.push(this.orders[i].orderNumber)
    }
    for (let i = 0; i < dict.length; i++) {
      const readyOrderNumber = this.orders.filter((order) => order.orderNumber === dict[i] && order.ready && order.tableNumber === tableNumber);
      const ordersNumber = this.orders.filter((order) => order.orderNumber === dict[i] && order.tableNumber === tableNumber);
      if (readyOrderNumber.length === ordersNumber.length && ordersNumber.length !== 0) res = true;
    }
    return res;
  }

  filterTable(type : TableStatus) {
    if(this.filterTables === type)  this.filterTables = TableStatus.ALL;
    else this.filterTables = type;
  }

  changeStatus(tableNumber: number, customers : number, occupied: boolean){
    this.dictionary[tableNumber] = customers;
    this.post.emit({tableNumber: tableNumber, customers: customers, occupied: occupied});
  }

  showPopup(tableNumber: number, seats: number, waiterId: string, occupied: boolean) {
    if (this.us.hasRole('Waiter', "Cashier")) {
      const isWaiter : boolean = waiterId === this.us.getEmail();

      if (this.dictionary[tableNumber] === undefined)
        this.dictionary[tableNumber] = this.tables.filter((table) => table.tableNumber === tableNumber)[0].customers;

      this.popup = {showed: true, seats: seats, tableNumber: tableNumber, isWaiter: isWaiter, occupied: occupied, customers: isWaiter ? this.dictionary[tableNumber] : 0};
    }
  }

  generateReceiptEvent(tableNumber : number) : void {
    this.receiptEvent.emit(tableNumber);
  }

  closePopup() {
    this.popup = {showed: false, seats: 0, tableNumber: 0, isWaiter: false, occupied: false, customers: 0}
  }

  modifyCustomers(){
    this.isModifyingCustomers = !this.isModifyingCustomers;
  }
}
