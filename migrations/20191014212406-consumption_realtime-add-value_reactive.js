module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'consumption_realtime',
      'value_reactive', {
        type: Sequelize.REAL,
        defaultValue: 0
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('consumption_realtime', 'value_reactive')
  }
}
