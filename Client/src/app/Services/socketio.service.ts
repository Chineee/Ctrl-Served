import {Injectable} from "@angular/core";
import {UserHttpService} from "./user-http.service";
import {Observable, Subscriber} from "rxjs";
import {io} from "socket.io-client";
import {SOCKET_URL} from "../Variables";

@Injectable()
export class SocketioService {

  private socket:any;
  constructor( private us: UserHttpService ) { }

  connect(): Observable< any > {

    this.socket = io(SOCKET_URL);

    return new Observable( (observer) => {

      switch(this.us.getRole()) {
        case 'Admin':
          this.setAdminSocket(observer);
          break;
        case 'Cashier':
          this.setCashierSocket(observer);
          break;
        case 'Waiter':
          this.setCashierSocket(observer);
          break;
        case 'Cook':
          this.setCookSocket(observer);
          break
        case 'Bartender':
          this.setBartenderSocket(observer);
          break;
        }
      // this.socket.on('error', (err:any) => {
      //   console.log('Socket.io error: ' + err );
      //   observer.error( err );
      // });

      // this.socket.on('table_modified', (m:any) => {
      //   observer.next(m);
      // });

      // this.socket.on('Order_sent', (m: any) => {
      //   observer.next(m);
      // })

      // this.socket.on('food_queue', (m: any) => {
      //   observer.next(m);
      // })

      // this.socket.on('order_finished', (m:any) => {
      //   observer.next(m);
      // })

      // this.socket.on('drink_queue_change', (m:any) => {
      //   observer.next(m);
      // });

      // this.socket.on('receipt_created', (m:any)=>{
      //   observer.next(m);
      // });

      // this.socket.on('user_modified', (m: any) => observer.next(m));
      // this.socket.on('order_modified', (m:any) => observer.next(m));

    });

  }

  disconnect() {
    this.socket?.disconnect();
  }

  setAdminSocket(observer: Subscriber<any>) {
    this.socket.on('table_modified', (m:any) => observer.next(m));
    this.socket.on('Order_sent', (m: any) => observer.next(m));
    this.socket.on('food_queue', (m: any) => observer.next(m));
    this.socket.on('order_finished', (m:any) => observer.next(m));
    this.socket.on('drink_queue_change', (m:any) => observer.next(m));
    this.socket.on('receipt_created', (m:any)=> observer.next(m));
    this.socket.on('user_modified', (m: any) => observer.next(m));
    this.socket.on('order_modified', (m:any) => observer.next(m));
    this.socket.on('menu', (m: any) => observer.next(m));
  }

  setCashierSocket(observer: Subscriber<any>) {
    this.socket.on('table_modified', (m:any) => observer.next());
    this.socket.on('Order_sent', (m: any) => observer.next(m));
    this.socket.on('order_finished', (m:any) => observer.next(m));
    this.socket.on('order_modified', (m:any) => observer.next(m));
    this.socket.on('user_modified', (m: any) => observer.next(m));
    this.socket.on('receipt_created', (m:any)=> observer.next(m));
    this.socket.on('menu', (m: any) => observer.next(m));
  }

  setWaiterSocket(observer: Subscriber<any>) {
    this.socket.on('table_modified', (m:any) => observer.next());
    this.socket.on('Order_sent', (m: any) => observer.next(m));
    this.socket.on('order_finished', (m:any) => observer.next(m));
    this.socket.on('order_modified', (m:any) => observer.next(m));
    this.socket.on('menu', (m:any)=>observer.next(m));
  }

  setCookSocket(observer: Subscriber<any>) {
    this.socket.on('order_sent', (m: any) => observer.next());
    this.socket.on('order_modified', (m: any) => observer.next());
    this.socket.on('food_queue', (m: any) => observer.next());
    this.socket.on('order_finished', (m:any) => observer.next(m));
    this.socket.on('menu', (m:any)=>observer.next(m));
  }

  setBartenderSocket(observer: Subscriber<any>) {
    this.socket.on('order_sent', (m: any) => observer.next());
    this.socket.on('order_modified', (m: any) => observer.next());
    this.socket.on('drink_queue_change', (m: any) => observer.next());
    this.socket.on('order_finished', (m:any) => observer.next(m));
    this.socket.on('menu', (m:any)=>observer.next(m));
  }

}
