'use strict'

let Sequelize = require('sequelize')

module.exports = function(sequelize) {
    return sequelize.define('scene', {
        json: Sequelize.TEXT,
        description: Sequelize.STRING,
        name: Sequelize.STRING,
        color: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true
    })
}

