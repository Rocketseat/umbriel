FROM node:12.14.0 AS base

RUN mkdir -p /home/node/app && \
    chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY package.json yarn.lock ./

RUN yarn install

EXPOSE 3333

CMD [ "yarn", "dev" ]

FROM base AS test

USER root

RUN apt update -y && \
    apt install mongodb -y && \
    mkdir -p /data/db && \
    mongod &

CMD [ "yarn", "jest", "--watch" ]
