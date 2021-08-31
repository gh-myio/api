const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const Model = sequelize.define('consumption_realtime', {
    slave_id: Sequelize.INTEGER,
    value: Sequelize.REAL,
    value_reactive: Sequelize.REAL,
    timestamp: Sequelize.DATE
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'consumption_realtime'
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Slave, {
      foreignKey: 'slave_id',
      onDelete: 'CASCADE'
    })
  }

  return Model
}
