module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('slaves', 'is_triphase')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'slaves',
      'is_triphase',
      Sequelize.BOOLEAN
    )
  }
}
