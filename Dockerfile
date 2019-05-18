FROM arm32v7/node:12

WORKDIR /api

COPY package.json package-lock.json ./

ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    npm install --production

COPY . .

CMD [ "npm", "start" ]
