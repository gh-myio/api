'use strict';

const env = process.env;

/*let db = {
    "username": env.DB_USERNAME || "docker",
    "password": env.DB_PASSWORD || "docker",
    "database": env.DB_DATABASE || "hubot",
    "host": env.DB_HOST || "localhost",
    "port": env.DB_PORT || 25432,
    "dialect": env.DB_DIALECT || "postgres",
    "storage": env.DB_STORAGE || undefined
};*/

let db = {
    'dialect': 'sqlite',
    'storage': './test.db'
};

module.exports = {
    db: db
};
