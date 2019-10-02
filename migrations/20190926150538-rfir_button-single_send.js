'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'rfir_buttons',
      'single_send', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('rfir_buttons', 'single_send')
  }
}
