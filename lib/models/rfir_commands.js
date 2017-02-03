'use strict';

/*
 * rfir_commands(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     device_id INTEGER NOT NULL,
 *     name VARCHAR(32) NOT NULL,
 *     page_low TINYINT NOT NULL,
 *     page_high TINYINT NOTNULL,
 *     FOREIGN KEY(device_id)
 *     REFERENCES rfir_devices(id) ON DELETE CASCADE
 * );
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('rfir_commands', {
        name: Sequelize.STRING,
        page_low: Sequelize.INTEGER,
        page_high: Sequelize.INTEGER
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsTo(models.RfirButtons);
            }
        }
    });

    return Model;
};
