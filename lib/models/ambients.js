'use strict';

/*
 * ambients (
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     name VARCHAR(255),
 *     image TEXT
 * );
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('ambients', {
        name: Sequelize.STRING,
        image: Sequelize.TEXT
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsToMany(models.RfirDevices, {
                    through: 'ambients_rfir_devices_rel'
                });
                Model.belongsToMany(models.Slave, {
                    through: 'ambients_rfir_slaves_rel'
                });
            }
        }
    });

    return Model;
};
