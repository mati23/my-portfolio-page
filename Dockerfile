FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install --force

COPY . .

cmd ["npm", "run", "dev"]