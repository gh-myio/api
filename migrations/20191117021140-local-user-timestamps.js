module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'createdAt', {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date()
        }
      ),
      queryInterface.addColumn(
        'users',
        'updatedAt', {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date()
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'createdAt'),
      queryInterface.removeColumn('users', 'updatedAt')
    ])
  }
}
