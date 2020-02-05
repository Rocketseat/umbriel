FROM node:lts-alpine

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api
WORKDIR /home/node/api

COPY package.json yarn.* ./
USER node
RUN yarn

COPY --chown=node:node . .

CMD ["yarn", "start"]
EXPOSE 3333