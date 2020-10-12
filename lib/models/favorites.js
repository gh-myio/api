const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('favorites', {
    user: Sequelize.UUID,
    ambients: Sequelize.JSON,
    consumption: Sequelize.JSON,
    devices: Sequelize.JSON
  }, {
    timestamps: false,
    underscored: true
  })

  return Model
}
