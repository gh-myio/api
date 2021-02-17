const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('favorites', {
    user: Sequelize.UUID,
    ambients: Sequelize.JSON,
    consumption: Sequelize.JSON,
    devices: Sequelize.JSON,
    scenes: Sequelize.JSON
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

  return Model
}
