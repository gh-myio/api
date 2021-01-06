/**
 * Actions summary:
 *
 * renameColumn(channel_id) => "alert_history"
 *
 */

const info = {
  revision: 2,
  name: 'refactor-alerts-channel',
  created: '2021-01-06T18:57:30.769Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'renameColumn',
      params: ['alert_history', 'channel_id', 'channel_channel', { transaction }]
    }
  ]
}

const rollbackCommands = (transaction) => {
  return [
    {
      fn: 'renameColumn',
      params: ['alert_history', 'channel_channel', 'channel_id', { transaction }]
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
