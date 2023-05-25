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
  protected popup = {showed: false, tableNumber: -1, seats: 0}
  protected customers : number = 0;
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
          return table.occupied && table.waiterId === this.us.getId();
      }
      return true;
    })
  }

  filterTable(type : TableStatus) {
    if(this.filterTables === type)  this.filterTables = TableStatus.ALL;
    else this.filterTables = type;
  }

  changeStatus(tableNumber: number, customers : number){
    this.post.emit({tableNumber: tableNumber, customers: customers});
  }

  showPopup(tableNumber: number, seats: number) {
    if (this.us.hasRole('Waiter')) {
      this.popup = {showed: true, seats: seats, tableNumber: tableNumber}
    }
  }

  closePopup() {
    this.popup = {showed: false, seats: 0, tableNumber: 0}
  }

  protected readonly Array = Array;
}
