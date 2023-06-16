import {Server} from "socket.io";
import * as http from "http";


let io : Server;

export function setUpSocketio(server : http.Server) : void {
    io = new Server(server, {
        cors: {
            origin: true
        }
    });

    io.on('connection', (client) => {
        console.log('Socket.io connected (Pippo)')
    });
    
    console.log("Socke.io created")
}

export default function getIoInstance() {
    return io;
}






