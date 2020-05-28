'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'alert_history', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        description: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        viewed: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        channel_id: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'channels'
            },
            key: 'id'
          }
        },
        slave_id: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'slaves'
            },
            key: 'id'
          }
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('alert_history')
  }
}
