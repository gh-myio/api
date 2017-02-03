'use strict';

/*
 * rfir_remotes (
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     device_id INTEGER NOT NULL,
 *     name VARCHAR(32) NOT NULL,
 *     FOREIGN KEY(device_id) REFERENCES rfir_devices(id) ON DELETE CASCADE
 * );
 *
 * OBS: device_id -> rfir_device_id
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('rfir_remotes', {
        name: Sequelize.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsTo(models.RfirDevices);
            }
        }
    });

    return Model;
};
