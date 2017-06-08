'use strict';

/*
 * CREATE TYPE period AS ENUM ('minute', 'hour', 'day', 'month', 'year');
 *
 * consumption (
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     timestamp TIMESTAMP WITH TIMEZONE,
 *     slave_id INTEGER,
 *     ambient_id INTEGER,
 *     value REAL,
 *     type PERIOD
 * );
 */
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('consumption', {
        timestamp: Sequelize.DATE,
        slaveId: {type: Sequelize.INTEGER, field: 'slave_id'},
        ambientId: {type: Sequelize.INTEGER, field: 'ambient_id'},
        value: Sequelize.REAL,
        type: Sequelize.ENUM('minute', 'hour', 'day', 'month', 'year')
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });
};

