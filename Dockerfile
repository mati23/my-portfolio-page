from node:16

WORKDIR /app

COPY package.json .

RUN npm install --force

COPY . . 

expose 80

CMD ["npm", "start"]