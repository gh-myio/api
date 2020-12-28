const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const NodeRedPersist = sequelize.define('node_red_persistence', {
    key: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    value: Sequelize.JSON
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  })

  NodeRedPersist.removeAttribute('id')

  return NodeRedPersist
}
