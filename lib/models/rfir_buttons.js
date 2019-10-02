const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('rfir_buttons', {
    name: Sequelize.STRING,
    indexes: Sequelize.STRING,
    color: Sequelize.INTEGER,
    type: Sequelize.STRING,
    single_send: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.RfirRemotes)
    Model.belongsTo(models.RfirCommands)
  }

  return Model
}
