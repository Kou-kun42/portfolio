FROM node:current-alpine

RUN mkdir -p /home/app
WORKDIR /home/app
ADD src .

RUN npm install

RUN npm install -g nodemon

EXPOSE 443

CMD nodemon server.js
