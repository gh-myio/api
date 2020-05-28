const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('alert_history', {
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    viewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    alertId: {
      type: Sequelize.INTEGER
    },
    channelId: {
      type: Sequelize.INTEGER
    },
    slaveId: {
      type: Sequelize.INTEGER
    },
    duration: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false,
    underscored: true
  })
  /*
  Model.associate = (models) => {
    Model.hasOne(models.Channels)
    Model.hasOne(models.Slave)
  } */

  return Model
}
