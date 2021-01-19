const Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * createTable() => "rfir_commands", deps: []
 * createTable() => "slaves", deps: []
 * createTable() => "schedules", deps: []
 * createTable() => "ambients", deps: []
 * createTable() => "consumption", deps: []
 * createTable() => "metadata", deps: []
 * createTable() => "logs", deps: []
 * createTable() => "users", deps: []
 * createTable() => "alert_history", deps: []
 * createTable() => "favorites", deps: []
 * createTable() => "scenes", deps: [ambients]
 * createTable() => "rfir_devices", deps: [slaves, rfir_commands, rfir_commands, slaves]
 * createTable() => "rfir_remotes", deps: [rfir_devices]
 * createTable() => "rfir_buttons", deps: [rfir_remotes, rfir_commands]
 * createTable() => "channels", deps: [channels, slaves, scenes, scenes, slaves]
 * createTable() => "raw_energy", deps: [slaves, rfir_remotes]
 * createTable() => "alarms", deps: [slaves]
 * createTable() => "consumption_alerts", deps: [slaves]
 * createTable() => "ambient_permissions", deps: [ambients]
 * createTable() => "ambients_rfir_devices_rel", deps: [rfir_devices, ambients]
 * createTable() => "ambients_rfir_slaves_rel", deps: [slaves, ambients]
 *
 */

const info = {
  revision: 1,
  name: 'mig-init',
  created: '2020-11-17T00:26:37.474Z',
  comment: ''
}

const migrationCommands = (transaction) => {
  return [
    {
      fn: 'createTable',
      params: [
        'rfir_commands',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          name: { type: Sequelize.STRING, field: 'name' },
          page_low: { type: Sequelize.INTEGER, field: 'page_low' },
          page_high: { type: Sequelize.INTEGER, field: 'page_high' },
          rfirDeviceId: {
            type: Sequelize.INTEGER,
            field: 'rfir_device_id',
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'slaves',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          type: { type: Sequelize.STRING, field: 'type' },
          addr_low: { type: Sequelize.INTEGER, field: 'addr_low' },
          addr_high: { type: Sequelize.INTEGER, field: 'addr_high' },
          channels: { type: Sequelize.INTEGER, field: 'channels' },
          name: { type: Sequelize.STRING, field: 'name' },
          color: { type: Sequelize.STRING, field: 'color' },
          code: { type: Sequelize.STRING, field: 'code' },
          clamp_type: { type: Sequelize.INTEGER, field: 'clamp_type' },
          config: { type: Sequelize.JSON, field: 'config' },
          temperature_correction: {
            type: Sequelize.INTEGER,
            field: 'temperature_correction',
            defaultValue: 0
          },
          aggregate: {
            type: Sequelize.BOOLEAN,
            field: 'aggregate',
            defaultValue: true
          },
          version: {
            type: Sequelize.STRING,
            field: 'version',
            defaultValue: '2.0.0'
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'schedules',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          action: { type: Sequelize.JSON, field: 'action' },
          name: { type: Sequelize.STRING, field: 'name' },
          cron: { type: Sequelize.STRING, field: 'cron' },
          active: { type: Sequelize.BOOLEAN, field: 'active' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'ambients',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          name: { type: Sequelize.STRING, field: 'name' },
          image: { type: Sequelize.TEXT, field: 'image' },
          order: { type: Sequelize.INTEGER, field: 'order' },
          config: { type: Sequelize.JSON, field: 'config' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'consumption',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          timestamp: { type: Sequelize.DATE, field: 'timestamp' },
          slaveId: { type: Sequelize.INTEGER, field: 'slave_id' },
          ambientId: { type: Sequelize.INTEGER, field: 'ambient_id' },
          value: { type: Sequelize.REAL, field: 'value' },
          type: {
            type: Sequelize.ENUM('minute', 'hour', 'day', 'month', 'year'),
            field: 'type'
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'metadata',
        {
          type: { type: Sequelize.STRING, field: 'type' },
          action: { type: Sequelize.STRING, field: 'action' },
          timestamp: { type: Sequelize.DATE, field: 'timestamp' },
          data: { type: Sequelize.TEXT, field: 'data' },
          user: { type: Sequelize.STRING, field: 'user' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'logs',
        {
          timestamp: { type: Sequelize.DATE, field: 'timestamp' },
          type: { type: Sequelize.STRING, field: 'type' },
          actionType: { type: Sequelize.STRING, field: 'action_type' },
          user: { type: Sequelize.STRING, field: 'user' },
          slaveId: { type: Sequelize.INTEGER, field: 'slave_id' },
          ambientId: { type: Sequelize.INTEGER, field: 'ambient_id' },
          sceneId: { type: Sequelize.INTEGER, field: 'scene_id' },
          channel: { type: Sequelize.INTEGER, field: 'channel' },
          rfirCommandId: { type: Sequelize.INTEGER, field: 'rfir_command_id' },
          value: { type: Sequelize.INTEGER, field: 'value' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'users',
        {
          UUID: {
            type: Sequelize.UUID,
            field: 'UUID',
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
          },
          name: { type: Sequelize.TEXT, field: 'name', allowNull: false },
          email: {
            type: Sequelize.TEXT,
            field: 'email',
            unique: true,
            allowNull: false
          },
          password: {
            type: Sequelize.TEXT,
            field: 'password',
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            field: 'createdAt',
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updatedAt',
            allowNull: false
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'alert_history',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          date: {
            type: Sequelize.DATE,
            field: 'date',
            defaultValue: Sequelize.NOW
          },
          viewed: {
            type: Sequelize.BOOLEAN,
            field: 'viewed',
            defaultValue: false
          },
          alertId: { type: Sequelize.INTEGER, field: 'alert_id' },
          channelId: { type: Sequelize.INTEGER, field: 'channel_id' },
          slaveId: { type: Sequelize.INTEGER, field: 'slave_id' },
          duration: { type: Sequelize.INTEGER, field: 'duration' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'favorites',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          user: { type: Sequelize.UUID, field: 'user' },
          ambients: { type: Sequelize.JSON, field: 'ambients' },
          consumption: { type: Sequelize.JSON, field: 'consumption' },
          devices: { type: Sequelize.JSON, field: 'devices' },
          scenes: { type: Sequelize.JSON, field: 'scenes' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'scenes',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          json: { type: Sequelize.TEXT, field: 'json' },
          description: { type: Sequelize.STRING, field: 'description' },
          name: { type: Sequelize.STRING, field: 'name' },
          color: { type: Sequelize.STRING, field: 'color' },
          config: { type: Sequelize.JSON, field: 'config' },
          ambientId: {
            type: Sequelize.INTEGER,
            field: 'ambient_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'ambients', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'rfir_devices',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          type: { type: Sequelize.STRING, field: 'type' },
          category: { type: Sequelize.STRING, field: 'category' },
          name: { type: Sequelize.STRING, field: 'name' },
          output: { type: Sequelize.STRING, field: 'output' },
          slaveId: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true
          },
          commandOnId: {
            type: Sequelize.INTEGER,
            field: 'command_on_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'rfir_commands', key: 'id' },
            allowNull: true
          },
          commandOffId: {
            type: Sequelize.INTEGER,
            field: 'command_off_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'rfir_commands', key: 'id' },
            allowNull: true
          },
          slave_id: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'rfir_remotes',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          name: { type: Sequelize.STRING, field: 'name' },
          rfirDeviceId: {
            type: Sequelize.INTEGER,
            field: 'rfir_device_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'rfir_devices', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'rfir_buttons',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          name: { type: Sequelize.STRING, field: 'name' },
          indexes: { type: Sequelize.STRING, field: 'indexes' },
          color: { type: Sequelize.INTEGER, field: 'color' },
          type: { type: Sequelize.STRING, field: 'type' },
          order: { type: Sequelize.INTEGER, field: 'order' },
          single_send: {
            type: Sequelize.BOOLEAN,
            field: 'single_send',
            defaultValue: false
          },
          rfirRemoteId: {
            type: Sequelize.INTEGER,
            field: 'rfir_remote_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'rfir_remotes', key: 'id' },
            allowNull: true
          },
          rfirCommandId: {
            type: Sequelize.INTEGER,
            field: 'rfir_command_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'rfir_commands', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'channels',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          type: { type: Sequelize.STRING, field: 'type' },
          channel: { type: Sequelize.INTEGER, field: 'channel' },
          name: { type: Sequelize.STRING, field: 'name' },
          config: { type: Sequelize.JSON, field: 'config' },
          channel_id: {
            type: Sequelize.INTEGER,
            field: 'channel_id',
            onUpdate: 'CASCADE',
            onDelete: 'cascade',
            references: { model: 'channels', key: 'id' },
            allowNull: true
          },
          slaveId: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true
          },
          scene_up_id: {
            type: Sequelize.INTEGER,
            field: 'scene_up_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'scenes', key: 'id' },
            allowNull: true
          },
          scene_down_id: {
            type: Sequelize.INTEGER,
            field: 'scene_down_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'scenes', key: 'id' },
            allowNull: true
          },
          slave_id: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'raw_energy',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          value: { type: Sequelize.INTEGER, field: 'value' },
          datetime: { type: Sequelize.INTEGER, field: 'datetime' },
          slaveId: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true
          },
          rfirRemoteId: {
            type: Sequelize.INTEGER,
            field: 'rfir_remote_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'rfir_remotes', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'alarms',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          created: {
            type: Sequelize.DATE,
            field: 'created',
            defaultValue: Sequelize.NOW
          },
          value: { type: Sequelize.INTEGER, field: 'value' },
          last_event: { type: Sequelize.BIGINT, field: 'last_event' },
          channel: { type: Sequelize.BIGINT, field: 'channel' },
          slaveId: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'consumption_alerts',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          name: { type: Sequelize.STRING, field: 'name' },
          slave_id: {
            type: Sequelize.INTEGER,
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'slaves', key: 'id' },
            allowNull: true,
            field: 'slave_id'
          },
          type: { type: Sequelize.STRING, field: 'type' },
          extra: { type: Sequelize.TEXT, field: 'extra' }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'ambient_permissions',
        {
          id: {
            type: Sequelize.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
          },
          expires: { type: Sequelize.DATE, field: 'expires' },
          user: { type: Sequelize.STRING, field: 'user' },
          createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at',
            allowNull: false
          },
          ambientId: {
            type: Sequelize.INTEGER,
            field: 'ambient_id',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            references: { model: 'ambients', key: 'id' },
            allowNull: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'ambients_rfir_devices_rel',
        {
          createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at',
            allowNull: false
          },
          rfirDeviceId: {
            type: Sequelize.INTEGER,
            field: 'rfir_device_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: { model: 'rfir_devices', key: 'id' },
            primaryKey: true
          },
          ambientId: {
            type: Sequelize.INTEGER,
            field: 'ambient_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: { model: 'ambients', key: 'id' },
            primaryKey: true
          }
        },
        { transaction }
      ]
    },
    {
      fn: 'createTable',
      params: [
        'ambients_rfir_slaves_rel',
        {
          createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
            allowNull: false
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at',
            allowNull: false
          },
          slaveId: {
            type: Sequelize.INTEGER,
            field: 'slave_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: { model: 'slaves', key: 'id' },
            primaryKey: true
          },
          ambientId: {
            type: Sequelize.INTEGER,
            field: 'ambient_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: { model: 'ambients', key: 'id' },
            primaryKey: true
          }
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
      params: ['channels', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['rfir_devices', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['rfir_buttons', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['rfir_commands', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['rfir_remotes', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['scenes', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['slaves', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['schedules', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['ambients', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['consumption', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['raw_energy', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['metadata', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['alarms', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['logs', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['consumption_alerts', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['ambient_permissions', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['users', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['alert_history', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['favorites', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['ambients_rfir_devices_rel', { transaction }]
    },
    {
      fn: 'dropTable',
      params: ['ambients_rfir_slaves_rel', { transaction }]
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
