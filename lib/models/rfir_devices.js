'use strict';
/*
 * rfir_devices(
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     slave_id INTEGER NOT NULL,
 *     type VARCHAR(16) NOT NULL,
 *     category VARCHAR(32),
 *     name VARCHAR(64) NOT NULL,
 *     description VARCHAR(128),
 *     model VARCHAR(255),
 *     FOREIGN KEY(slave_id) REFERENCES slaves(id) ON DELETE CASCADE
 * );
`rfir_devices` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `type` VARCHAR(255),
    `category` VARCHAR(255),
    `name` VARCHAR(255),
    `description` VARCHAR(255),
    `model` VARCHAR(255),
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    `slave_id` INTEGER REFERENCES `slaves` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('rfir_devices', {
        type: Sequelize.STRING,
        category: Sequelize.STRING,
        name: Sequelize.STRING,
        description: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsTo(models.Slave);
                Model.belongsToMany(models.Ambients, {
                    through: 'ambients_rfir_devices_rel'
                });
                Model.hasMany(models.RfirRemotes);
                Model.hasMany(models.RfirCommands, {
                    constraints: false
                });
                Model.belongsTo(models.RfirCommands, {
                    as: 'command_on'
                });
                Model.belongsTo(models.RfirCommands, {
                    as: 'command_off'
                });
            }
        }
    });

    return Model;
};
