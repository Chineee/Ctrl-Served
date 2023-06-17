import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Table} from "../models/Table"

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent implements OnInit{
  @Input() tables : Table[] = [];
  
  ngOnInit() {}
}
