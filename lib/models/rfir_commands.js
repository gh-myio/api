/*
 * rfir_commands(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 *     device_id INTEGER NOT NULL,
 *     name VARCHAR(32) NOT NULL,
 *     page_low TINYINT NOT NULL,
 *     page_high TINYINT NOTNULL,
 *     FOREIGN KEY(device_id)
 *     REFERENCES rfir_devices(id) ON DELETE CASCADE
 * )
 */
const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Model = sequelize.define('rfir_commands', {
    name: Sequelize.STRING,
    page_low: Sequelize.INTEGER,
    page_high: Sequelize.INTEGER
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
    Model.hasOne(models.RfirButtons)
  }

  return Model
}
