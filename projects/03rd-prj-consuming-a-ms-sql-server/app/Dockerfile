FROM node:14

WORKDIR /src/usr/03rd-app

COPY ./package*.json ./

RUN npm install

COPY . ./

RUN npm run build