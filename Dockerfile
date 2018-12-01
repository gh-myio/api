FROM node:6

WORKDIR /api

COPY package.json .
COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
