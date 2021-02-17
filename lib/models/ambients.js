const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('ambients', {
    name: Sequelize.STRING,
    image: Sequelize.TEXT,
    order: Sequelize.INTEGER,
    config: Sequelize.JSON
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
    Model.belongsToMany(models.RfirDevices, {
      through: 'ambients_rfir_devices_rel'
    })

    Model.belongsToMany(models.Slave, {
      through: 'ambients_rfir_slaves_rel'
    })
  }

  return Model
}
