'use strict';
/*
 * channels(
 *    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *    slave_id INTEGER NOT NULL,
 *    type VARCHAR(32) NOT NULL,
 *    channel TINYINT NOT NULL,
 *    name VARCHAR(64) NOT NULL,
 *    description VARCHAR(128),
 * );
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('channels', {
        type: Sequelize.STRING,
        channel: Sequelize.INTEGER,
        name: Sequelize.STRING,
        description: Sequelize.STRING
    });
};

