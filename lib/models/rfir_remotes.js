const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('rfir_remotes', {
    name: Sequelize.STRING
  }, {
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {
      timestamps: () => {
        return {
          attributes: {
            include: ['createdAt', 'updatedAt']
          }
        }
      }
    }
  })

  Model.associate = (models) => {
    Model.belongsTo(models.RfirDevices)
    Model.hasMany(models.RfirButtons)
  }

  return Model
}
