'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'alert_history',
      'date', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'alert_history',
      'date'
    )
  }
}
