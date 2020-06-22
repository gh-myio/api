const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('ambient_permissions', {
    expires: Sequelize.DATE,
    user: Sequelize.STRING
  }, {
    timestamps: true,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Ambients, {
      onDelete: 'SET NULL'
    })
  }

  return Model
}
