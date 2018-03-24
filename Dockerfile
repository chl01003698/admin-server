FROM node:9.5.0-alpine

MAINTAINER cuiweiqiang

WORKDIR /app

RUN apk update && apk add  tzdata \
    && cp -r -f /usr/share/zoneinfo/Asia/Chongqing /etc/localtime

ADD ./package.json /app/

RUN npm install --registry=https://registry.npm.taobao.org

ADD ./dist /app/dist

EXPOSE 7001

ENV NODE_ENV=production

CMD npm start