'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('alert_history', 'title'),
      queryInterface.removeColumn('alert_history', 'description')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'alert_history',
        'title',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'alert_history',
        'description',
        Sequelize.TEXT
      )
    ])
  }
}
