import {Injectable} from "@angular/core";
import {UserHttpService} from "./user-http.service";
import {Observable} from "rxjs";
import {io} from "socket.io-client";

@Injectable()
export class SocketioService {

  private socket:any;
  constructor( private us: UserHttpService ) { }

  connect(): Observable< any > {

    this.socket = io('http://host.docker.internal:5000');

    return new Observable( (observer) => {

      //todo settare le connessioni con il socket in base al ruolo che si ha


      this.socket.on('broadcast', (m:any) => {
        console.log('Socket.io message received: ' + JSON.stringify(m) );
        observer.next( m );
      });

      this.socket.on('error', (err:any) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      this.socket.on('table_modified', (m:any) => {
        observer.next(m);
      });

      this.socket.on('Order_sent', (m: any) => {
        observer.next(m);
      })

      this.socket.on('food_queue', (m: any) => {
        observer.next(m);
      })

      this.socket.on('order_finished', (m:any) => {
        observer.next(m);
      })
      
      this.socket.on('drink_queue_change', (m:any) => {
        observer.next(m);
      })

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe: () => {
          this.socket.disconnect();
        }
      };

    });

  }

  setAdminSocker() {

  }

  setCashierSocker() {

  }

  setWaiterSocket() {

  }

  setCookSocket() {

  }

  setBartenderSocket() {

  }

}
