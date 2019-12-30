const Sequelize = require('sequelize')
const Promise = require('bluebird')
const _ = require('lodash')

module.exports = (sequelize) => {
  const Model = sequelize.define('slaves', {
    type: Sequelize.STRING,
    addr_low: Sequelize.INTEGER,
    addr_high: Sequelize.INTEGER,
    channels: Sequelize.INTEGER,
    name: Sequelize.STRING,
    color: Sequelize.STRING,
    code: Sequelize.STRING,
    clamp_type: Sequelize.INTEGER,
    temperature_correction: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    aggregate: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    version: {
      type: Sequelize.STRING,
      defaultValue: '2.0.0'
    }
  }, {
    underscored: true,
    timestamps: false
  })

  Model.associate = (models) => {
    Model.belongsToMany(models.Ambients, {
      through: 'ambients_rfir_slaves_rel'
    })
    Model.hasMany(models.Channels, {
      as: 'channels_list',
      foreignKey: 'slave_id'
    })
    Model.hasMany(models.RawEnergy, {
      as: 'slave_id'
    })
    Model.hasMany(models.RfirDevices, {
      as: 'devices',
      foreignKey: 'slave_id'
    })
  }

  Model.beforeDestroy((instance) => {
    const Scenes = sequelize.import('./scenes')

    return Promise.all([
      Scenes.findAll(),
      instance.getChannels_list(),
      instance.getDevices()
    ])
      .then((results) => {
        const scenes = results[0]
        const channels = _.map(results[1], (channel) => channel.toJSON())
        const devices = _.map(results[2], (device) => device.toJSON())

        return Promise.all(_.map(scenes, (scene) => {
          let data = JSON.parse(scene.json)

          data = _.filter(data, (accessory) => {
            const channelFound = _.find(channels, {
              id: accessory.accessory_id,
              slave_id: accessory.id
            })

            return !channelFound
          })

          data = _.filter(data, (accessory) => {
            const deviceFound = _.find(devices, {
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

  const updateTemperatureCorrection = (instance) => {
    console.log('Sending update temperature command')
    if (instance.type === 'infrared') {
      require('../WebSocketHandler').send(JSON.stringify({
        type: 'slave',
        command: 'temperature_correction_update',
        id: instance.id,
        temperatureCorrection: instance.temperature_correction
      }))
    }
  }

  const updateSlaveClamps = (instance) => {
    console.log('Sending update clamp command')
    // Tell erlradio to send update command to hardware
    if ((instance.type === 'outlet' || instance.type === 'three_phase_sensor') &&
            instance.clamp_type !== undefined) {
      require('../WebSocketHandler').send(JSON.stringify({
        type: 'slave',
        command: 'config_clamp',
        id: instance.id,
        clamp_type: instance.clamp_type
      }))
    }
  }

  Model.afterUpdate((instance) => {
    updateSlaveClamps(instance)
    updateTemperatureCorrection(instance)
  })

  Model.afterCreate((instance) => {
    updateSlaveClamps(instance)
    updateTemperatureCorrection(instance)
  })

  return Model
}
