const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('ambient_permissions', {
    ambient_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    expires: Sequelize.DATE,
    user: Sequelize.STRING
  }, {
    timestamps: true,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Ambients, {
      foreignKey: 'ambient_id',
      onDelete: 'CASCADE',
      allowNull: false
    })
  }

  return Model
}
