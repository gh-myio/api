FROM arm32v7/node:slim

WORKDIR /api

ENV TZ=Etc/UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package.json .
COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
