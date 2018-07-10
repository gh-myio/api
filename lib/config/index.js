'use strict';

const env = process.env;

let db = {
    "username": env.DB_USERNAME || "hubot",
    "password": env.DB_PASSWORD || "hubot",
    "database": env.DB_DATABASE || "hubot",
    "host": env.DB_HOST || "localhost",
    "port": env.DB_PORT || 5432,
    "dialect": env.DB_DIALECT || "postgres",
    "storage": env.DB_STORAGE || undefined
};

let ws = env.SOCKET_URL || 'ws://10.8.0.12:3000/websocket';

module.exports = {
    db: db,
    ws: ws
};
