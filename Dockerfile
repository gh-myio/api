FROM arm32v7/node:stretch

WORKDIR /api

COPY package.json .
COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
