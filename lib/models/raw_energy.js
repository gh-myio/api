'use strict';

/*
 * raw_energy (
 *     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     value INTEGER NOT NULL,
 *     datetime INTEGER,
 *     slave_id INTEGER,
 *     FOREIGN KEY(slave_id) REFERENCES slave(id)
 * );
 */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let Model = sequelize.define('raw_energy', {
        value: Sequelize.INTEGER,
        datetime: Sequelize.INTEGER
    }, {
        timestamps: false,
        underscored: true,
        classMethods: {
            associate: function(models) {
                Model.belongsTo(models.RfirRemotes);
            }
        },
        tableName: 'raw_energy'
    });

    return Model;
};
