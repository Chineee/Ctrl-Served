FROM node:latest AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000 443
COPY ./Keys/cert.pem /usr/src/app/dist/client/keys/
COPY ./Keys/key.pem /usr/src/app/dist/client/keys/
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/client /usr/share/nginx/html



