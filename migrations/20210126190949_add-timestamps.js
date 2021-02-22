const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * addColumn(created_at) => "channels"
 * addColumn(updated_at) => "channels"
 * addColumn(created_at) => "rfir_devices"
 * addColumn(updated_at) => "rfir_devices"
 * addColumn(created_at) => "rfir_buttons"
 * addColumn(updated_at) => "rfir_buttons"
 * addColumn(created_at) => "rfir_commands"
 * addColumn(updated_at) => "rfir_commands"
 * addColumn(created_at) => "rfir_remotes"
 * addColumn(updated_at) => "rfir_remotes"
 * addColumn(created_at) => "scenes"
 * addColumn(updated_at) => "scenes"
 * addColumn(created_at) => "slaves"
 * addColumn(updated_at) => "slaves"
 * addColumn(created_at) => "schedules"
 * addColumn(updated_at) => "schedules"
 * addColumn(created_at) => "ambients"
 * addColumn(updated_at) => "ambients"
 * addColumn(created_at) => "alarms"
 * addColumn(updated_at) => "alarms"
 * addColumn(created_at) => "consumption_alerts"
 * addColumn(updated_at) => "consumption_alerts"
 * addColumn(created_at) => "favorites"
 * addColumn(updated_at) => "favorites"
 *
 */

const info = {
  revision: 5,
  name: 'add-timestamps',
  created: '2021-01-26T19:09:49.288Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'addColumn',
      params: [
        'channels',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'channels',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_devices',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_devices',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_buttons',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_buttons',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_commands',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_commands',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_remotes',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'rfir_remotes',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'scenes',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'scenes',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'slaves',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'slaves',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'schedules',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'schedules',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'ambients',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'ambients',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'alarms',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'alarms',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'consumption_alerts',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'consumption_alerts',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'favorites',
        'created_at',
        { type: Sequelize.DATE, field: 'created_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    },
    {
      fn: 'addColumn',
      params: [
        'favorites',
        'updated_at',
        { type: Sequelize.DATE, field: 'updated_at', allowNull: false, defaultValue: Sequelize.literal('now()') },
        { transaction }
      ]
    }
  ]
}

const rollbackCommands = (transaction) => {
  return [
    {
      fn: 'removeColumn',
      params: ['channels', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['channels', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_devices', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_devices', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_buttons', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_buttons', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_commands', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_commands', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_remotes', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['rfir_remotes', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['scenes', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['scenes', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['slaves', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['slaves', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['schedules', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['schedules', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['ambients', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['ambients', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['alarms', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['alarms', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['consumption_alerts', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['consumption_alerts', 'updated_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['favorites', 'created_at', { transaction }]
    },
    {
      fn: 'removeColumn',
      params: ['favorites', 'updated_at', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['node_red_persistence', { transaction }]
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
