'use strict'

let Sequelize = require('sequelize')

module.exports = (sequelize) => {
    let Model = sequelize.define('ambients', {
        name: Sequelize.STRING,
        image: Sequelize.TEXT
    }, {
        timestamps: false,
        underscored: true
    })


    Model.associate = (models) => {
        Model.belongsToMany(models.RfirDevices, {
            through: 'ambients_rfir_devices_rel'
        })

        Model.belongsToMany(models.Slave, {
            through: 'ambients_rfir_slaves_rel'
        })
    }

    return Model
}
