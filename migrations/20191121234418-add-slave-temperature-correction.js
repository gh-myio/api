module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'slaves',
      'temperature_correction',
      Sequelize.INTEGER
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('slaves', 'temperature_correction')
  }
}
