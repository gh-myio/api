module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('consumption_realtime', 'consumption_realtime_timestamp_idx')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('consumption_realtime', ['timestamp'], { indexName: 'consumption_realtime_timestamp_idx' })
  }
}
