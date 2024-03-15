const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * changeColumn(ambient_id) => "ambient_permissions"
 *
 */

const info = {
  revision: 10,
  name: 'noname',
  created: '2024-02-21T19:36:45.720Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'changeColumn',
      params: [
        'ambient_permissions',
        'ambient_id',
        {
          type: Sequelize.INTEGER,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: { model: 'ambients', key: 'id' },
          field: 'ambient_id',
          allowNull: false
        },
        { transaction }
      ]
    }
  ]
}

const rollbackCommands = (transaction) => {
  return [
    {
      fn: 'changeColumn',
      params: [
        'ambient_permissions',
        'ambient_id',
        {
          type: Sequelize.INTEGER,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: { model: 'ambients', key: 'id' },
          field: 'ambient_id',
          allowNull: true
        },
        { transaction }
      ]
    }
  ]
}

const pos = 0
const useTransaction = true

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos
  const run = (transaction) => {
    const commands = _commands(transaction)
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index]
          console.log(`[#${index}] execute: ${command.fn}`)
          index++
          queryInterface[command.fn](...command.params).then(next, reject)
        } else resolve()
      }
      next()
    })
  }
  if (this.useTransaction) {
    return queryInterface.sequelize.transaction(run)
  }
  return run(null)
}

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) => {
    return execute(queryInterface, sequelize, migrationCommands)
  },
  down: (queryInterface, sequelize) => {
    return execute(queryInterface, sequelize, rollbackCommands)
  },
  info
}
