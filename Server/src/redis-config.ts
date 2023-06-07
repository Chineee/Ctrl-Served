import * as redis from "redis";
import Orders from "./models/Orders";

let client;

(async () => {
    client = redis.createClient({
        socket: {
            host: 'host.docker.internal',
            port: 6379
        }
    });

    client.on("connect", () => console.log("Redis connected"))
    client.on("error", (err) => console.log(err))
    const maxOrderNumber = (await Orders.find({}).sort({orderNumber: -1}).limit(1))[0];
    await client.connect();
    await client.set("orderNumber", maxOrderNumber !== undefined ? maxOrderNumber.orderNumber + 1 : 1)
})();

export default client;



