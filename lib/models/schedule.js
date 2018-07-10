'use strict'

let Sequelize = require('sequelize')
let Scheduler = require('../../scheduler')

module.exports = function(sequelize) {
    let Model = sequelize.define('schedule', {
        action: Sequelize.JSON,
        name: Sequelize.STRING,
        color: Sequelize.STRING,
        cron: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true
    })

    Model.afterUpdate(() => Scheduler.prepare())
    Model.afterDestroy(() => Scheduler.prepare())
    Model.afterCreate(() => Scheduler.prepare())

    return Model
}
