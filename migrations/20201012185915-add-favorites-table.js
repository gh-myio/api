'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('favorites', {
      ambients: Sequelize.JSON,
      consumption: Sequelize.JSON,
      devices: Sequelize.JSON
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('favorites')
  }
}
