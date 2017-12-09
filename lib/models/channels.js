'use strict'

let Sequelize = require('sequelize')

module.exports = (sequelize) => {
    let Model = sequelize.define('channels', {
        type: Sequelize.STRING,
        channel: Sequelize.INTEGER,
        name: Sequelize.STRING,
        description: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.Slave)
        Model.belongsTo(models.Scenes)
    }

    return Model
}
