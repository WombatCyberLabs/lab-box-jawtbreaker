FROM node:10.23-buster-slim

COPY . /app

WORKDIR /app

RUN npm install

RUN rm Dockerfile

RUN useradd express

RUN chown -R express:express /app

USER express

EXPOSE 8080

CMD node index.js 
