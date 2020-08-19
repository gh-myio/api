'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'consumption_alerts',
      'name', {
        type: Sequelize.STRING,
        defaultValue: '-'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('consumption_alerts', 'name')
  }
}
