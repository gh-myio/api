'use strict';
/*
 * slaves(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *         type VARCHAR(32) NOT NULL,
 *         addr_low TINYINT NOT NULL,
 *         addr_high TINYINT NOT NULL,
 *         channels TINYINT NOT NULL,
 *         name VARCHAR(32) NOT NULL,
 *         description VARCHAR(128)
 * );
 */
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('rfir_devices', {
        type: Sequelize.STRING,
        category: Sequelize.STRING,
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        model: Sequelize.STRING
    });
};
