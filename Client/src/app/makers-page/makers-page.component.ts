import {Component, OnInit} from '@angular/core';
import {QueueHttpService} from "../Services/queue-http.service";
import {UserHttpService} from "../Services/user-http.service";
import {Dish} from "../models/Dish";
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";
import {Queue} from "../models/Queue";

@Component({
  selector: 'app-makers-page',
  templateUrl: './makers-page.component.html',
  styleUrls: ['./makers-page.component.css'],
})
export class MakerPageComponent implements OnInit {

  protected queueDish : Queue[] = [];
  constructor(private queue : QueueHttpService, protected us : UserHttpService, private router : Router, private so : SocketioService) {}
  ngOnInit(): void {
    if(!this.us.hasRole("Cook", "Bartender")){
      this.router.navigate(['/login'])
    }
    else {
      // this.us.logout();
      this.getQueue();
      this.so.connect().subscribe({
        next: (data) => {
          this.getQueue();
        },
        error: (err) => {
          this.logout();
        }
      })
    }
  }

  backToAdmin() {
    this.so.disconnect();
    this.router.navigate(['/admins'])
  }

  logout() {
    this.so.disconnect()
    this.us.logout()
    this.router.navigate(['/login'])
  }
  /*
  getQueue will get all food queue, it also will filter and sort the array returned by:
  first by order number (so we uso a FIFO, if a table order first, they will probably be served first ), and then a group of order
  will be sorted by production time (first longer production time, and then lower production time).
 If an order has begun but makerId is different from current user, order won't be showed
   */
  getQueue() {
    this.queue.getQueue(this.us.getRole() as string).subscribe({
      next: (data) => {
        this.queueDish = data.filter((order) => !order.end)
          .filter((queue : Queue) => queue.makerId === this.us.getId() || !queue.begin)
          .sort((q1 : Queue, q2 : Queue) => {
            if (q1.orderNumber < q2.orderNumber) return -1;
            if (q1.orderNumber === q2.orderNumber && q1.dish.productionTime >= q2.dish.productionTime) return -1;
            if (q1.orderNumber === q2.orderNumber && q1.dish.productionTime < q2.dish.productionTime) return 1;
            return 1;
        });
        console.log(this.queueDish);
      },
      error: (err) => {
        this.logout()
      }
    })
  }

  modifyOrderQueue(id: string) {
    this.queue.putQueue(id, this.us.getRole() as string).subscribe({
      next: (data) => {
        if (data.data.end) this.queue.deleteFromQueue(data.data._id, this.us.getRole() as string).subscribe({})
      },
      error: (err) => {
        this.logout();
      }
    });
  }
}
