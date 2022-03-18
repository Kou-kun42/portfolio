FROM node:latest

RUN mkdir -p /home/app
WORKDIR /home/app
ADD src .

RUN npm install

EXPOSE 443

CMD npm start
