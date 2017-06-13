'use strict';

/*
 * channels(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     slave_id INTEGER NOT NULL,
 *     type VARCHAR(32) NOT NULL,
 *     channel TINYINT NOT NULL,
 *     name VARCHAR(64) NOT NULL,
 *     description VARCHAR(128),
 *     FOREIGN KEY(slave_id) REFERENCES slaves(id) ON DELETE CASCADE
 * );
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('channels', {
        type: Sequelize.STRING,
        channel: Sequelize.INTEGER,
        name: Sequelize.STRING,
        description: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsTo(models.Slave);
                Model.belongsTo(models.Scenes);
            }
        }
    });

    return Model;
};
