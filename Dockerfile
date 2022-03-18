FROM node:current-alpine

RUN mkdir -p /home/app
WORKDIR /home/app
ADD src .

RUN npm install

EXPOSE 443

CMD npm run start
