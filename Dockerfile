# syntax=docker/dockerfile:1
FROM node:18

LABEL version="1.0"
LABEL description="docker container for ease of use with backend local dev server"

RUN mkdir /server
WORKDIR /server

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --frozen-lockfile
EXPOSE 8080
COPY . .
CMD ["npm", "start"]