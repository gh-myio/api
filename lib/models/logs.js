const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const Model = sequelize.define('logs', {
    timestamp: Sequelize.DATE,
    type: {
      type: Sequelize.STRING,
      field: 'type'
    },
    actionType: {
      type: Sequelize.STRING,
      field: 'action_type'
    },
    user: {
      type: Sequelize.STRING,
      field: 'user'
    },
    slaveId: {
      type: Sequelize.INTEGER,
      field: 'slave_id'
    },
    ambientId: {
      type: Sequelize.INTEGER,
      field: 'ambient_id'
    },
    sceneId: {
      type: Sequelize.INTEGER,
      field: 'scene_id'
    },
    channel: {
      type: Sequelize.INTEGER,
      field: 'channel'
    },
    rfirCommandId: {
      type: Sequelize.INTEGER,
      field: 'rfir_command_id'
    },
    value: {
      type: Sequelize.INTEGER,
      field: 'value'
    }
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  })

  Model.removeAttribute('id')

  return Model
}
