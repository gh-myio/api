'use strict'

let Sequelize = require('sequelize')

module.exports = (sequelize) => {
    let Model = sequelize.define('ambient_permissions', {
        expires: Sequelize.DATE,
        user: Sequelize.STRING
    }, {
        timestamps: true,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.Ambients)
    }

    return Model
}