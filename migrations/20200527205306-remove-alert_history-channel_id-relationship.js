'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'alert_history',
      'channel_id'
    )

    return queryInterface.addColumn(
      'alert_history',
      'channel_id',
      Sequelize.INTEGER
    )
  },

  down: async (queryInterface, Sequelize) => {}
}
