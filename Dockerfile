FROM arm32v6/node:12-alpine

WORKDIR /api

COPY package.json package-lock.json ./

ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    npm install --production

COPY consumption/requirements.txt .

RUN apk --no-cache add --update \
    python \
    python-dev \
    py-pip \
    build-base \
    postgresql-dev \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

RUN virtualenv /env && \
    /env/bin/pip install -r requirements.txt && \
    rm requirements.txt

COPY . .

CMD [ "npm", "start" ]
