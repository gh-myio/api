const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('environment',
    {
      key: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      value: Sequelize.STRING
    },
    {
      timestamps: false,
      underscored: true,
      freezeTableName: true
    }
  )

  return Model
}
