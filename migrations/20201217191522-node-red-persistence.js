'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('node_red_persistence', {
      'key': {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
      },
      'value': Sequelize.JSON
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('node_red_persistence')
  }
}
