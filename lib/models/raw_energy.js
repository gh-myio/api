const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('raw_energy', {
    value: Sequelize.INTEGER,
    datetime: Sequelize.INTEGER
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'raw_energy'
  })

  Model.associate = (models) => {
    Model.belongsTo(models.RfirRemotes)
  }

  return Model
}
