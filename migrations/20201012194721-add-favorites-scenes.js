'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'favorites',
      'scenes', {
        type: Sequelize.JSON
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'favorites',
      'scenes'
    )
  }
}
