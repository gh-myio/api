const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * changeColumn(rfir_command_id) => "rfir_buttons"
 * changeColumn(rfir_remote_id) => "rfir_buttons"
 *
 */

const info = {
  revision: 11,
  name: 'noname',
  created: '2024-02-21T19:48:11.304Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'changeColumn',
      params: [
        'rfir_buttons',
        'rfir_command_id',
        {
          type: Sequelize.INTEGER,
          field: 'rfir_command_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: { model: 'rfir_commands', key: 'id' },
          allowNull: true
        },
        { transaction }
      ]
    },
    {
      fn: 'changeColumn',
      params: [
        'rfir_buttons',
        'rfir_remote_id',
        {
          type: Sequelize.INTEGER,
          field: 'rfir_remote_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: { model: 'rfir_remotes', key: 'id' },
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
      fn: 'changeColumn',
      params: [
        'rfir_buttons',
        'rfir_command_id',
        {
          type: Sequelize.INTEGER,
          field: 'rfir_command_id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'rfir_commands', key: 'id' },
          allowNull: true
        },
        { transaction }
      ]
    },
    {
      fn: 'changeColumn',
      params: [
        'rfir_buttons',
        'rfir_remote_id',
        {
          type: Sequelize.INTEGER,
          field: 'rfir_remote_id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'rfir_remotes', key: 'id' },
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
