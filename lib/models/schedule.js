const Sequelize = require('sequelize')
const Scheduler = require('../../scheduler')

module.exports = function (sequelize) {
  const Model = sequelize.define('schedule', {
    action: Sequelize.JSON,
    name: Sequelize.STRING,
    cron: Sequelize.STRING,
    active: Sequelize.BOOLEAN
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

  Model.afterUpdate(() => Scheduler.prepare())
  Model.afterDestroy(() => Scheduler.prepare())
  Model.afterCreate(() => Scheduler.prepare())

  return Model
}
