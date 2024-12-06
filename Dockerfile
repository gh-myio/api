FROM node:12.15.0-alpine AS builder

WORKDIR /api

COPY package.json package-lock.json ./

RUN npm install --production --verbose

FROM node:12.15.0-alpine

ENV TZ=America/Sao_Paulo

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apk add tzdata

WORKDIR /api

COPY --from=builder /api /api

COPY . .

CMD [ "npm", "start" ]
