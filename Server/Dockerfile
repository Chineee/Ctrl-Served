FROM node:latest
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]