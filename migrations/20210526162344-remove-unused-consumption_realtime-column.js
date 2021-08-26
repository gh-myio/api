module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'consumption_realtime',
      'ambient_id'
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'consumption_realtime',
      'ambient_id',
      Sequelize.INTEGER
    )
  }
}
