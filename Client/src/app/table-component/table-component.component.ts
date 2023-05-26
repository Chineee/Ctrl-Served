import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Type} from '@angular/core';
import {TablesHttpService} from '../Services/tables-http.service';
import {Table} from "../models/Table";
import {UserHttpService} from "../Services/user-http.service";


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
  @Output() public post = new EventEmitter<any>;
  public filterTables : TableStatus = TableStatus.ALL;
  protected readonly TableStatus = TableStatus;
  protected popup = {showed: false, tableNumber: -1, seats: 0, isWaiter: false, occupied: false, customers: 0}
  protected customers : number = 0;
  protected readonly Array = Array;
  protected isModifyingCustomers: boolean = false;
  protected dictionary : any = {};

  constructor(protected us : UserHttpService) {
  }
  
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

  filterTable(type : TableStatus) {
    if(this.filterTables === type)  this.filterTables = TableStatus.ALL;
    else this.filterTables = type;
  }

  changeStatus(tableNumber: number, customers : number, occupied: boolean){
    this.dictionary[tableNumber] = customers;
    this.post.emit({tableNumber: tableNumber, customers: customers, occupied: occupied});
  }

  showPopup(tableNumber: number, seats: number, waiterId: string, occupied: boolean) {
    if (this.us.hasRole('Waiter')) {
      const isWaiter : boolean = waiterId === this.us.getEmail();

      if (this.dictionary[tableNumber] === undefined)
        this.dictionary[tableNumber] = this.tables.filter((table) => table.tableNumber === tableNumber)[0].customers;

      this.popup = {showed: true, seats: seats, tableNumber: tableNumber, isWaiter: isWaiter, occupied: occupied, customers: isWaiter ? this.dictionary[tableNumber] : 0};
    }
  }

  closePopup() {
    this.popup = {showed: false, seats: 0, tableNumber: 0, isWaiter: false, occupied: false, customers: 0}
  }

  modifyCustomers(){
    this.isModifyingCustomers = !this.isModifyingCustomers;
  }
}
