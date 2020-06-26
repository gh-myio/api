'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'slaves',
      'config', {
        type: Sequelize.JSON
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'slaves',
      'config'
    )
  }
}
