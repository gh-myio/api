'use strict'

let Sequelize = require('sequelize')

module.exports = (sequelize) => {
    let Model = sequelize.define('rfir_buttons', {
        name: Sequelize.STRING,
        indexes: Sequelize.STRING,
        color: Sequelize.INTEGER,
        type: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.RfirRemotes)
    }

    return Model
}
