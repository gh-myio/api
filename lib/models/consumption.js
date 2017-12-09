'use strict'

let Sequelize = require('sequelize')

module.exports = function(sequelize) {
    return sequelize.define('consumption', {
        timestamp: Sequelize.DATE,
        slaveId: {type: Sequelize.INTEGER, field: 'slave_id'},
        ambientId: {type: Sequelize.INTEGER, field: 'ambient_id'},
        value: Sequelize.REAL,
        type: Sequelize.ENUM('minute', 'hour', 'day', 'month', 'year')
    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true
    })
}

