# Stage 1: Building the client
FROM node:latest AS client-builder

WORKDIR /usr/src/app/client

COPY ./client/package*.json ./

RUN npm install

COPY ./client .

CMD ["npm", "run", "start"]

# Stage 2: Building the server
FROM node:latest AS server-builder

WORKDIR /usr/src/app/server

COPY ./server/package*.json ./

RUN npm install
RUN npm install -g nodemon
# Here, instead of `npm install sqlite3`, you can do `npm rebuild` to ensure the binary is built for the Docker environment
RUN npm install sqlite3
RUN npm install sqlite

COPY ./server .

CMD ["npm", "run", "dev"]

# Stage 3: WebSocket Server
FROM node:latest AS websocket-builder

WORKDIR /usr/src/app/server

COPY ./server/package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY ./server .

CMD ["npm", "run", "websocket"]
