const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const Model = sequelize.define('consumption_alerts', {
    slave_id: Sequelize.INTEGER,
    type: Sequelize.STRING,
    extra: Sequelize.TEXT
  }, {
    timestamps: false,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Slave, {
      foreignKey: 'slave_id',
      onDelete: 'cascade'
    })
  }

  return Model
}
