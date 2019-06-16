'use strict'

let Sequelize = require('sequelize')
let Promise = require('bluebird')
let _ = require('lodash')

module.exports = function(sequelize) {
    let Model = sequelize.define('scene', {
        json: Sequelize.TEXT,
        description: Sequelize.STRING,
        name: Sequelize.STRING,
        color: Sequelize.STRING
    }, {
        timestamps: false,
        underscored: true
    })

    Model.associate = (models) => {
        Model.belongsTo(models.Ambients)
    }

    Model.beforeDestroy((instance) => {
        let Channel = sequelize.import('./channels')

        return Channel.findAll({
            where: {
                scene_id: instance.id
            }
        }).then((channels) => {
            if (channels.length === 0) return Promise.resolve()

            let destroying = _.map(channels, (channel) => {
                return channel.destroy()
            })

            return Promise.all(destroying)
        })
    })

    return Model
}
