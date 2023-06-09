

To run this application be sure you have installed docker on your machine. 

**First of all be sure the following ports are free:**
```
1) 4200, for frontend 
2) 49153, for docker watcher windows file 
3) 3050, for nginx 
4) 5000, for backend 
5) 6379, for redis cache 
6) 27018 for mongodb 
```
If one of them isn't, change it from the docker-compose.yml file


If you want to run this app in dev mode use the following command line
```bash
make dev
```
instead if you want to run this app in production use the following command line.
```bash
make start
```

**If you don't have make installed on your machine check use the followings commands:**

1. Dev
```bash
docker-compose -f docker-compose.yml up
```
2. Production
```bash
docker-compose up
```