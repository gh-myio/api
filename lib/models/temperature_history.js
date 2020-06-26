const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const TemperatureHistory = sequelize.define('temperature_history', {
    timestamp: Sequelize.DATE,
    value: Sequelize.NUMBER
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  })

  TemperatureHistory.removeAttribute('id')

  TemperatureHistory.associate = (models) => {
    TemperatureHistory.belongsTo(models.Slave, {
      foreignKey: 'slave_id',
      onDelete: 'SET NULL'
    })
  }

  return TemperatureHistory
}
