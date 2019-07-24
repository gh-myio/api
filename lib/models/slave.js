'use strict'

let Sequelize = require('sequelize')
let db = require('./index')
let Promise = require('bluebird')
let _ = require('lodash')
let ws = require('../WebSocketHandler')

module.exports = (sequelize) => {
    let Model = sequelize.define('slaves', {
        type: Sequelize.STRING,
        addr_low: Sequelize.INTEGER,
        addr_high: Sequelize.INTEGER,
        channels: Sequelize.INTEGER,
        name: Sequelize.STRING,
        color: Sequelize.STRING,
        code: Sequelize.STRING,
        clamp_type: Sequelize.INTEGER
    }, {
        underscored: true,
        timestamps: false
    })

    Model.associate = (models) => {
        Model.belongsToMany(models.Ambients, {
            through: 'ambients_rfir_slaves_rel'
        })
        Model.hasMany(models.Channels, {
            'as': 'channels_list',
            'foreignKey': 'slave_id'
        })
        Model.hasMany(models.RawEnergy, {
            'as': 'slave_id'
        })
        Model.hasMany(models.RfirDevices, {
            'as': 'devices',
            'foreignKey': 'slave_id'
        })
    }

    Model.beforeDestroy((instance) => {
        let Scenes = sequelize.import('./scenes')

        return Promise.all([
            Scenes.findAll(),
            instance.getChannels_list(),
            instance.getDevices()
        ])
        .then((results) => {
            let scenes = results[0]
            let channels = _.map(results[1], (channel) => channel.toJSON())
            let devices = _.map(results[2], (device) => device.toJSON())

            return Promise.all(_.map(scenes, (scene) => {
                let data = JSON.parse(scene.json)

                data = _.filter(data, (accessory) => {
                    let channelFound = _.find(channels, {
                        id: accessory.accessory_id,
                        slave_id: accessory.id
                    })

                    return !channelFound
                })

                data = _.filter(data, (accessory) => {
                    let deviceFound = _.find(devices, {
                        id: accessory.accessory_id,
                        slave_id: accessory.id
                    })

                    return !deviceFound
                })

                scene.json = JSON.stringify(data)

                return scene.save()
            }))
        })
    })

    Model.afterUpdate((instance) => {
        // Tell erlradio to send update command to hardware
        if (instance.type === 'three_phase_sensor' && instance.clamp_type) {
            ws.send(JSON.stringify({
                type: 'slave',
                command: 'update_clamp_type',
                id: instance.id,
                type: instance.clamp_type
            }))
        }
    })

    return Model
}
