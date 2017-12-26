'use strict'

let Sequelize = require('sequelize')

module.exports = function(sequelize) {
    return sequelize.define('metadata', {
        type: Sequelize.ENUM('temperature', 'user_action'),
        action: Sequelize.STRING,
        timestamp: Sequelize.DATE,
        data: Sequelize.TEXT,
        user: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    })
}
