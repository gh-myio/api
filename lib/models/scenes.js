'use strict';

/*
 * scenes (
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     json TEXT,
 *     description VARCHAR(64),
 *     name VARCHAR(64)
 * );
 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('scene', {
        json: Sequelize.TEXT,
        description: Sequelize.STRING,
        name: Sequelize.STRING
    }, {
        underscored: true
    });
};

