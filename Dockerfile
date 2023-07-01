FROM node:12-buster-slim

COPY . /app

WORKDIR /app

RUN npm install

RUN rm Dockerfile

RUN chown -R node:node /app/avatars

USER node

EXPOSE 8080

CMD node index.js 
