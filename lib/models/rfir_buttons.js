'use strict';
/*
 * rfir_buttons (
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     remote_id INTEGER NOT NULL,
 *     command_id INTEGER NOT NULL,
 *     name VARCHAR(32) NOT NULL,
 *     indexes VARCHAR(52) NOT NULL, color INTEGER,
 *     FOREIGN KEY(command_id) REFERENCES rfir_commands(id) ON DELETE CASCADE,
 *     FOREIGN KEY(remote_id) REFERENCES rfir_remotes(id) ON DELETE CASCADE
 * );
CREATE TABLE `rfir_buttons` (`id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `type` VARCHAR(255),
    `name` VARCHAR(255),
    `model` VARCHAR(255),
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    `rfir_device_id` INTEGER REFERENCES `rfir_devices` (`id`) ONDELETE SET NULL ON UPDATE CASCADE,
    `rfir_remote_id` INTEGER REFERENCES `rfir_remotes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);
 */


const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('rfir_buttons', {
        name: Sequelize.STRING,
        indexes: Sequelize.STRING,
        color: Sequelize.INTEGER
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsTo(models.RfirRemotes);
                //Model.hasOne(models.RfirCommands);
            }
        }
    });

    return Model;
};
