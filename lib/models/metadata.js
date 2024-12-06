const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const Metadata = sequelize.define('metadata', {
    type: Sequelize.STRING,
    action: Sequelize.STRING,
    timestamp: Sequelize.DATE,
    data: Sequelize.TEXT,
    user: Sequelize.STRING
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  })

  Metadata.removeAttribute('id')

  return Metadata
}
