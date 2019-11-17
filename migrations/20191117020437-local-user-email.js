module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'email', {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'email')
  }
}
