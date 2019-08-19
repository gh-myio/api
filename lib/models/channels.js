const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('channels', {
    type: Sequelize.STRING,
    channel: Sequelize.INTEGER,
    name: Sequelize.STRING
    // description: Sequelize.STRING
  }, {
    timestamps: false,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Slave)
    Model.belongsTo(models.Scenes)
  }

  Model.hasOne(Model, {
    as: 'parent',
    foreignKey: 'channel_id',
    onDelete: 'cascade',
    hooks: true
  })

  return Model
}
