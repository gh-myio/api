const Sequelize = require('sequelize')
const Promise = require('bluebird')
const _ = require('lodash')

module.exports = (sequelize) => {
  const Model = sequelize.define('channels', {
    type: Sequelize.STRING,
    channel: Sequelize.INTEGER,
    name: Sequelize.STRING,
    config: Sequelize.JSON
    // description: Sequelize.STRING
  }, {
    timestamps: true,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Slave)
    Model.belongsTo(models.Scenes, {
      foreignKey: 'scene_up_id'
    })
    Model.belongsTo(models.Scenes, {
      foreignKey: 'scene_down_id'
    })
    Model.hasMany(
      models.AlertHistory,
      {
        onDelete: 'CASCADE',
        allowNull: true
      }
    )
    Model.hasMany(
      models.ConsumptionAlerts,
      {
        onDelete: 'CASCADE',
        allowNull: true
      }
    )
  }

  Model.beforeDestroy(async (instance) => {
    const Scenes = sequelize.import('./scenes')

    const scenes = await Scenes.findAll()

    let scenesUpdated = false

    const actions = _.map(scenes, async (scene) => {
      const data = JSON.parse(scene.json)

      const newData = _.filter(data, (accessory) => {
        if (accessory.accessory_id === instance.id &&
            accessory.id === instance.slave_id) {
          return false
        }

        return true
      })

      if (newData.length !== data.length) {
        scene.json = JSON.stringify(newData)
        console.log('Updating scene, channel got deleted.')

        scenesUpdated = true

        return scene.save()
      }

      return Promise.resolve()
    })

    await Promise.all(actions)

    if (scenesUpdated) {
      console.log('Scene updated, sending to erlang')
      require('../WebSocketHandler').send(JSON.stringify({
        type: 'admin',
        command: 'scenes_updated'
      }))
    }
  })

  Model.hasOne(Model, {
    as: 'parent',
    foreignKey: 'channel_id',
    onDelete: 'cascade',
    hooks: true
  })

  return Model
}
