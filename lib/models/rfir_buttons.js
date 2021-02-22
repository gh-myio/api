const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('rfir_buttons', {
    name: Sequelize.STRING,
    indexes: Sequelize.STRING,
    color: Sequelize.INTEGER,
    type: Sequelize.STRING,
    order: Sequelize.INTEGER,
    single_send: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
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
    Model.belongsTo(models.RfirRemotes)
    Model.belongsTo(models.RfirCommands)
  }

  return Model
}
