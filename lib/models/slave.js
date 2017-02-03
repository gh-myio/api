'use strict';

/*
 * slaves(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *    type VARCHAR(32) NOT NULL,
 *    addr_low TINYINT NOT NULL,
 *    addr_high TINYINT NOT NULL,
 *    channels TINYINT NOT NULL,
 *    name VARCHAR(32) NOT NULL,
 *    description VARCHAR(128)
 * );
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('slaves', {
        type: Sequelize.STRING,
        addr_low: Sequelize.INTEGER,
        addr_high: Sequelize.INTEGER,
        channels: Sequelize.INTEGER,
        name: Sequelize.STRING,
        description: Sequelize.STRING
    }, {
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsToMany(models.Ambients, {
                    through: 'ambients_rfir_slaves_rel'
                });
            }
        }
    });

    return Model;
};
