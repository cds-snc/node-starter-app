FROM node:10-alpine
LABEL maintainer="-"

ARG GITHUB_SHA_ARG

COPY . /src

WORKDIR /src

RUN npm install --quiet --production

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]