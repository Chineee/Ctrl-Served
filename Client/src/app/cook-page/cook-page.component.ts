import {Component, OnInit} from '@angular/core';
import {QueueHttpService} from "../Services/queue-http.service";
import {UserHttpService} from "../Services/user-http.service";
import {Dish} from "../models/Dish";
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";
import {Queue} from "../models/Queue";



@Component({
  selector: 'app-cook-page',
  templateUrl: './cook-page.component.html',
  styleUrls: ['./cook-page.component.css']
})
export class CookPageComponent implements OnInit {

  protected queueFood : Queue[] = [];
  constructor(private queue : QueueHttpService, private us : UserHttpService, private router : Router, private so : SocketioService) {}
  ngOnInit(): void {
    console.log(this.us.getRole());
    if(!this.us.hasRole("Cook")){
      this.router.navigate(['/test'])
    }
    else {
      this.getQueue();
      this.so.connect().subscribe({
        next: (data) => {
          console.log("SOCKETTINO")
        },
        error: (err) => console.log('NOOOOOO')
      })
    }
  }
  //no mie e iniziate
  getQueue() {
    this.queue.getQueue().subscribe({
      next: (data) => {
        this.queueFood = data.filter((order) => !order.end)
          .filter((queue : Queue) => queue.makerId === this.us.getId() || !queue.begin)
          .sort((q1 : Queue, q2 : Queue) => {
          if (q1.orderNumber < q2.orderNumber) return -1;
          if (q1.orderNumber === q2.orderNumber) return 0;
          return 1;
        });
        console.log(this.queueFood);
      },
      error: (err) => console.log(err)
    })
  }



}
