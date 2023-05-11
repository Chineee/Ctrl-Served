

To run this application be sure you have installed docker on your machine. 

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