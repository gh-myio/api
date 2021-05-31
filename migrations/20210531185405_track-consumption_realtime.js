const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * changeColumn() => "consumption_realtime", deps: [slaves]
 *
 */

const info = {
  revision: 7,
  name: 'track-consumption_realtime',
  created: '2021-05-31T18:54:05.390Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'changeColumn',
      params: [
        'consumption_realtime',
        'slave_id',
        {
          type: Sequelize.INTEGER,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: { model: 'slaves', key: 'id' },
          allowNull: false,
          field: 'slave_id'
        },
        { transaction }
      ]
    }
  ]
}

const rollbackCommands = (transaction) => {
  return [
    {
      fn: 'dropTable',
      params: ['consumption_realtime', { transaction }]
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
