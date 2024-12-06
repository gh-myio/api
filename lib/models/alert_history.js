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
    channelChannel: {
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
    underscored: true,
    freezeTableName: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Channels)
  }

  return Model
}
