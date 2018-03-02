'use strict'

let Sequelize = require('sequelize')

module.exports = (sequelize) => {
    let Model = sequelize.define('alarms', {
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        value: Sequelize.INTEGER,
        last_event: Sequelize.BIGINT,
        channel: Sequelize.BIGINT
    }, {
        timestamps: false,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.Slave)
    }

    return Model
}
