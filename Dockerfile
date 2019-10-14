FROM arm32v7/node:12 AS builder

WORKDIR /api

COPY package.json package-lock.json ./

RUN npm install --production --verbose

FROM arm32v6/node:12-alpine

ENV TZ=America/Sao_Paulo

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apk add tzdata

WORKDIR /api

COPY --from=builder /api /api

COPY . .

CMD [ "npm", "start" ]
