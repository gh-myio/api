'use strict'

let Sequelize = require('sequelize')

module.exports = (sequelize) => {
    let Model = sequelize.define('rfir_remotes', {
        name: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.RfirDevices)
        Model.hasMany(models.RfirButtons)
    }

    return Model
}
