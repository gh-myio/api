const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * addColumn(channel_id) => "consumption_alerts"
 *
 */

const info = {
  revision: 4,
  name: 'add-channel-id-to-consumption-alerts',
  created: '2021-01-07T15:10:47.952Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'addColumn',
      params: [
        'consumption_alerts',
        'channel_id',
        {
          type: Sequelize.INTEGER,
          field: 'channel_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: { model: 'channels', key: 'id' },
          allowNull: true
        },
        { transaction }
      ]
    }
  ]
}

const rollbackCommands = (transaction) => {
  return [
    {
      fn: 'removeColumn',
      params: ['consumption_alerts', 'channel_id', { transaction }]
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
