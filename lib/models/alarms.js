const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('alarms', {
    created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    value: Sequelize.INTEGER,
    last_event: Sequelize.BIGINT,
    channel: Sequelize.BIGINT
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
    Model.belongsTo(models.Slave)
  }

  return Model
}
