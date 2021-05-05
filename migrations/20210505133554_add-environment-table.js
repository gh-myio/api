const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * createTable() => "environment", deps: []
 *
 */

const info = {
  revision: 6,
  name: 'add-environment-table',
  created: '2021-05-05T13:35:54.455Z',
  comment: ''
}

const migrationCommands = (transaction) => [
  {
    fn: 'createTable',
    params: [
      'environment',
      {
        key: { type: Sequelize.STRING, field: 'key', primaryKey: true },
        value: { type: Sequelize.STRING, field: 'value' }
      },
      { transaction }
    ]
  }
]

const rollbackCommands = (transaction) => [
  {
    fn: 'dropTable',
    params: ['environment', { transaction }]
  }
]

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
  if (useTransaction) return queryInterface.sequelize.transaction(run)
  return run(null)
}

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info
}
