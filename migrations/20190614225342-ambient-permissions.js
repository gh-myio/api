module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ambient_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user: Sequelize.STRING,
      ambient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ambients',
          key: 'id'
        }
      },
      expires: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ambient_permissions')
  }
}
