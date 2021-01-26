const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('rfir_devices', {
    type: Sequelize.STRING,
    category: Sequelize.STRING,
    name: Sequelize.STRING,
    output: Sequelize.STRING
  }, {
    timestamps: true,
    underscored: true,
    classMethods: {}
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Slave)
    Model.belongsToMany(models.Ambients, {
      through: 'ambients_rfir_devices_rel'
    })
    Model.hasMany(models.RfirRemotes)
    Model.hasMany(models.RfirCommands, {
      constraints: false
    })
    Model.belongsTo(models.RfirCommands, {
      as: 'command_on'
    })
    Model.belongsTo(models.RfirCommands, {
      as: 'command_off'
    })
  }

  return Model
}
