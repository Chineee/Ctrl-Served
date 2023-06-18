import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Table} from "../models/Table"
import { TablesHttpService } from '../Services/tables-http.service';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent implements OnInit{
  @Input() tables : Table[] = [];
  protected popup : {showed: boolean, tableNumber?: number, seats?: number, } = {showed: false};
  protected success : {success ?: boolean, message ?: string} = {}; 
  protected newTableNumber : number = 1; 
  protected newTableSeats : number = 1;
  
  constructor(private ts : TablesHttpService){}

  ngOnInit() : void {}

  existsTableSelected() : boolean {
    return this.tables.some(table => table.tableNumber === this.newTableNumber) && this.newTableNumber !== undefined;
  }

  modifyTable(obj : any) : void {
    this.ts.modifyTableSeats(obj.tableNumber, obj.newTableSeats).subscribe({
      next: (data) => this.success = {success: true, message: "Table modified successfully"}
    })
  }

  setErrorFalse() : void {
    this.success = {};
  }

  createTable(tableNumber: number, seats: number) {
    this.ts.createTable({tableNumber: tableNumber, seats: seats}).subscribe({
      next: (data) => this.success = {success:true, message: 'Table created successfully'}
    });
    this.closePopup();
  }

  deleteTable(table_id ?: string) : void {
    this.ts.deleteTable(table_id as string).subscribe({
      next: (data) => this.success = {success: true, message: 'Table deleted successfully'}
    });
    this.closePopup();
  }

  createPopup() : void {
    this.popup = {showed: true,}
  }

  closePopup() : void {
    this.newTableNumber = 0;
    this.newTableSeats = 0;
  }

}
