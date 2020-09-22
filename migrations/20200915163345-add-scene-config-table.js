'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'scenes',
      'config', {
        type: Sequelize.JSON
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'scenes',
      'config'
    )
  }
}
