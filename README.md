

To run this application be sure you have installed docker on your machine.
Then create a docker network:
```bash
docker network create tawproject
```

**First of all be sure the following ports are free:**
For development:
```
1) 4200, for the frontend 
2) 49153, for the docker watcher windows file 
4) 5000, for the backend 
5) 6379, for the redis cache 
6) 27018 for the mongodb database
```

For production:
```
1) 3000 and 443 for the frontend hosted by nginx
2) 5000 for the backend
3) 6379 for the redis cache
4) 27018 for the mongodb database
```
In order to run this application in development mode, without SSL/TLS:
```bash
docker-compose up
```

In order to run this application in production mode, with HTTP and SSL/TLS:
```
1) create your own private key and digtial certificate and add them to the 'client/Keys' and 'server/Keys' folders as cert.pem for the certificate and key.pem for the private key
2) change the docker file client container, and select the "Dockerfile" file instead of the "Dockerfile.dev" file
3) remove the ports used and substitute them with 3000:3000 and 443:443
4) Go insisde the socketio-configfile and pass a https.server as parameter instead of http.server
```
```bash
docker-compose up
```
default user you can use for testing
```
| email                | password   | role      |
|----------------------|------------|-----------|
| cameriere@gmail.com  | cameriere  | Waiter    |
| cameriere2@gmail.com | cameriere2 | Waiter    |
| barista@gmail.com    | barista    | Bartender |
| cuoco@gmail.com      | cuoco      | Cook      |
| cassiere@gmail.com   | cassiere   | Cashier   |
| admin@gmail.com      | admin      | Admin     |
```
Database will be filled up with some default data:
```
1) Some dishes and drinks
2) Some users with some default stats
3) some tables
4) some receipts
5) there won't be orders in default database, add them on your own by creating a new one
```