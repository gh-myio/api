const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const Promise = require('bluebird')
const _ = require('lodash')

const Scheduler = require('../../scheduler')

module.exports = function (sequelize) {
  const Model = sequelize.define('scene', {
    json: Sequelize.TEXT,
    description: Sequelize.STRING,
    name: Sequelize.STRING,
    color: Sequelize.STRING,
    config: Sequelize.JSON
  }, {
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      timestamps: () => {
        return {
          attributes: {
            include: ['createdAt', 'updatedAt']
          }
        }
      }
    }
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Ambients, {
      onDelete: 'SET NULL'
    })
  }

  Model.beforeDestroy((instance) => {
    const Channel = sequelize.import('./channels')

    return Channel.findAll({
      where: {
        [Op.or]: [{
          scene_up_id: instance.id
        }, {
          scene_down_id: instance.id
        }]
      }
    }).then((channels) => {
      if (channels.length === 0) return Promise.resolve()

      const destroying = _.map(channels, (channel) => {
        return channel.destroy()
      })

      return Promise.all(destroying)
    })
  })

  Model.afterDestroy(async (instance) => {
    await sequelize.query(`
DELETE
FROM
    "public"."schedules" s
WHERE
  (s.action::JSONB ->> 'type') = 'scene'
  AND (s.action::JSONB ->> 'id')::INT = :id
`,
    {
      replacements: { id: instance.id },
      type: Sequelize.SELECT
    }
    )
    Scheduler.prepare()
  })

  return Model
}
