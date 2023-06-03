import{Component,EventEmitter, Output, Input} from '@angular/core';
import {Queue} from "../models/Queue";

interface Popup {
  showed: boolean,
  name ?: string,
  begin ?: boolean,
  id : string
}

export enum Status {
  START,
  END
}

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {
  @Output() orderEvent = new EventEmitter<string>; //event sent by cook when he begin or end a order
  @Input() public queue: Queue[] = []; //list of order of type foods which cook has to cook, they are already ordered
  protected popup : Popup = {showed: false, id:""}
  protected Status = Status //to use enum in html we have to define a new field referenced to the enum/interface

  ngOnInit(): void {

  }
  
  openPopup(index: number) {
    if (index === 0 || index > 0 && this.queue[index-1].begin) {
      this.popup = {showed: true, name: this.queue[index].dish.name, begin:this.queue[index].begin, id:this.queue[index]._id}
    }
  }

  closePopup() {
    this.popup = {showed:false, id:""}
  }

  changeStatus(id: string) {
   this.orderEvent.emit(id);
  }
}
