import * as redis from "redis";

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
    await client.connect();
})();

export default client;



