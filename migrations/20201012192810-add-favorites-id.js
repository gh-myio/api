'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'favorites',
      'id', {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'favorites',
      'id'
    )
  }
}
