# syntax = docker/dockerfile:1.0-experimental
FROM node:20-alpine

RUN apk add --no-cache openssh-client git

RUN --mount=type=secret,id=npm,target=.npmrc

WORKDIR /app

COPY package.json yarn.lock ./
COPY . .
RUN --mount=type=ssh yarn install

RUN yarn build

CMD yarn start
EXPOSE 3005

#docker build . -t secure-app-secrets:1.0 --secret id=npmrc,src=$HOME/.npmrc
