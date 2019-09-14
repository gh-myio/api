'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'slaves',
      'version', {
        type: Sequelize.STRING,
        defaultValue: '1.0.0'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('slaves', 'version')
  }
}
