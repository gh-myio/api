FROM arm32v7/node:12.15.0-alpine@sha256:855407c09c53efd2526f92778e17ebb05e19a9a365f4c1d1980532fed2ddad87 AS builder

WORKDIR /api

COPY package.json package-lock.json ./

RUN npm install --production --verbose

FROM arm32v7/node:12.15.0-alpine@sha256:855407c09c53efd2526f92778e17ebb05e19a9a365f4c1d1980532fed2ddad87

ENV TZ=America/Sao_Paulo

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apk add tzdata

WORKDIR /api

COPY --from=builder /api /api

COPY . .

CMD [ "npm", "start" ]
