FROM arm32v7/node:12 AS builder

WORKDIR /api

COPY package.json package-lock.json ./

ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    npm install --production --verbose

FROM arm32v6/node:12-alpine

WORKDIR /api

COPY --from=builder /api /api

COPY consumption/requirements.txt .

RUN apk --no-cache add --update \
    python \
    python-dev \
    py-pip \
    build-base \
    postgresql-dev \
  && rm -rf /var/cache/apk/*

RUN pip install -r requirements.txt && \
    rm requirements.txt

COPY . .

CMD [ "npm", "start" ]
