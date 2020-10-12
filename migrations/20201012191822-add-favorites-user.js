'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'favorites',
      'user', {
        type: Sequelize.UUID
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'favorites',
      'user'
    )
  }
}
