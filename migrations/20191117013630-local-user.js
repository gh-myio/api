'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      UUID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
}
