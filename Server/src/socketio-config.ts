import {Server} from "socket.io";
import * as https from "https";


let io : Server;

export function setUpSocketio(server : https.Server) : void {
    io = new Server(server, {
        cors: {
            origin: true
        }
    });

    io.on('connection', (client) => {
        console.log('Socket.io connected (Pippo)')
    });
    
    console.log("Socket.io created")
}

export default function getIoInstance() {
    return io;
}






