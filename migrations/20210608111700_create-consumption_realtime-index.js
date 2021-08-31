module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('consumption_realtime', ['slave_id', 'timestamp'])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('consumption_realtime', ['slave_id', 'timestamp'])
  }
}
