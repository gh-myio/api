'use strict'

let Sequelize = require('sequelize')
let Promise = require('bluebird')
let _ = require('lodash')

module.exports = function(sequelize) {
    let Model = sequelize.define('consumption_realtime', {
        slave_id: Sequelize.INTEGER,
        ambient_id: Sequelize.INTEGER,
        value: Sequelize.REAL,
        timestamp: Sequelize.DATE
    }, {
        timestamps: false,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.Slave, {
            foreignKey: 'slave_id',
            onDelete: 'cascade'
        })
    }

    return Model
}
