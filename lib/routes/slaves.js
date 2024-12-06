const models = require('../models').Models
const sequelize = require('../models').sequelize
const Sequelize = require('sequelize')
const _ = require('lodash')
const channelsState = require('../ChannelsState')
const slaveState = require('../SlaveState')
const infraredState = require('../InfraredState')
const utils = require('../utils')

const Op = Sequelize.Op

async function setTemperature (req, res, next) {
  const slaveId = parseInt(req.params.slaveId, 10)
  const temperature = req.params.temperature

  try {
    const slave = await models.Slave.findOne({
      where: {
        id: slaveId
      },
      include: [{
        model: models.RfirDevices,
        as: 'devices',
        include: [{
          model: models.RfirCommands
        }]
      }]
    })

    const commandIds = _getCommandsFromDevices(slave.devices)

    const buttons = await models.RfirButtons.findAll({
      rfir_command_id: {
        [Op.in]: commandIds
      }
    })

    const button = buttons.find(button => button.name.indexOf(temperature) > -1)

    const payload = {
      type: 'slave',
      id: slaveId,
      command: 'transmit',
      rfir_command_id: button.rfirCommandId
    }

    require('../WebSocketHandler').send(JSON.stringify(payload))

    res.send({
      status: 'ok'
    })
  } catch (e) {
    res.send({
      status: 'not ok'
    })
  }
}

async function execute (req, res, next) {
  const action = req.body.action

  const data = await models.Slave.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.Channels,
      as: 'channels_list'
    }, {
      model: models.RfirDevices,
      as: 'devices',
      include: [{
        model: models.RfirCommands
      }]
    }]
  })

  if (!data) {
    res.status(404)
    return res.send({
      message: 'Slave not found.'
    })
  }

  console.log(req.body)

  let payload = {}

  switch (action) {
    case 'on':
      console.log(`ON command on slave ${data.id}, channel: ${req.body.channel}`)
      payload = {
        type: 'slave',
        id: data.id,
        command: 'light_control',
        channel: req.body.channel,
        value: 100
      }
      break
    case 'off':
      console.log(`OFF command on slave ${data.id}, channel: ${req.body.channel}`)
      payload = {
        type: 'slave',
        id: data.id,
        command: 'light_control',
        channel: req.body.channel,
        value: 0
      }
      break
    case 'brightness':
      console.log(`BRIGHTNESS command on slave ${data.id}, channel: ${req.body.channel}`)
      payload = {
        type: 'slave',
        id: data.id,
        command: 'light_control',
        channel: req.body.channel,
        value: req.body.value
      }
      break
    case 'transmit':
      console.log(`TEMPERATURE command on slave ${data.id}, button: ${req.body.commandId}`)
      payload = {
        type: 'slave',
        id: data.id,
        command: 'transmit',
        rfir_command_id: req.body.commandId
      }
      break
  }

  require('../WebSocketHandler').send(JSON.stringify(payload))

  res.send({
    status: 'ok'
  })
}

async function find (req, res, next) {
  const data = await models.Slave.scope('timestamps').findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.Channels,
      as: 'channels_list'
    }, {
      model: models.RfirDevices,
      as: 'devices',
      include: [{
        model: models.RfirCommands
      }]
    }]
  })

  if (!data) {
    res.status(404)
    return res.send({
      message: 'Slave not found.'
    })
  }

  if (!utils.isModified(req, res, data.updatedAt)) {
    return res.send()
  }

  const commandIds = _getCommandsFromDevices(data.devices)

  const buttons = await models.RfirButtons.findAll({
    rfir_command_id: {
      [Op.in]: commandIds
    }
  })

  const slave = data.toJSON()

  slave.devices = slave.devices.map(device => {
    const commands = device.rfir_commands.map(command => command.id)

    device.buttons = _.filter(buttons, button => {
      return commands.indexOf(button.rfirCommandId) > -1
    })

    delete device.rfir_commands

    return device
  })

  if (slave.type === 'infrared') {
    delete slave.channels

    slave.battery = infraredState.getSlaveBattery(slave.id)
    slave.temperature = infraredState.getSlaveTemperature(slave.id)
  }

  slave.status = slaveState.getSlaveState(slave.id)
  slave.number_of_channels = slave.channels
  delete slave.channels

  slave.channels_list = _.map(
    slave.channels_list,
    channel => Object.assign({}, channel, channelsState.getChannelState(slave.id, channel.channel))
  )

  res.json(slave)
}

function _getCommandsFromDevices (devices) {
  return _.flatten(devices.map(device => {
    return device.rfir_commands.map(command => command.id)
  }))
}

async function findAll (req, res, next) {
  const lastModifiedSlave = await models.Slave.scope('timestamps').findOne({
    order: [['updated_at', 'DESC']],
    attributes: ['updatedAt']
  })
  if (lastModifiedSlave && !utils.isModified(req, res, lastModifiedSlave.updatedAt)) {
    return res.send()
  }

  const user = req.user

  const permissions = {
    attributes: [],
    model: models.AmbientPermissions,
    where: {
      user: {
        [Op.eq]: user.id
      }
    }
  }

  const slaves = await models.Slave.findAll({
    include: [
      {
        model: models.Channels,
        as: 'channels_list'
      },
      {
        model: models.RfirDevices,
        as: 'devices',
        include: [{
          model: models.RfirCommands
        }]
      },
      {
        required: user.role !== 'admin',
        model: models.Ambients,
        attributes: [],
        include: [
          permissions
        ]
      }
    ]
  })

  const commandIds = _.chain(slaves)
    .map(slave => {
      return _getCommandsFromDevices(slave.devices)
    })
    .flatten()
    .value()

  const buttons = await models.RfirButtons.findAll({
    rfir_command_id: {
      [Op.in]: commandIds
    }
  })

  const payload = slaves.map(slave => {
    slave = slave.toJSON()

    slave.devices = slave.devices.map(device => {
      const commands = device.rfir_commands.map(command => command.id)

      device.buttons = _.filter(buttons, button => {
        return commands.indexOf(button.rfirCommandId) > -1
      })

      return device
    })

    if (slave.type === 'infrared') {
      delete slave.channels

      slave.battery = infraredState.getSlaveBattery(slave.id)
      slave.temperature = infraredState.getSlaveTemperature(slave.id)
    } else {
      slave.lastConsumption = slaveState.getSlaveConsumption(slave.id)
      slave.temperature = slaveState.getSlaveTemperature(slave.id)
    }

    slave.pulses = slaveState.getPulseState(slave.id)
    slave.status = slaveState.getSlaveState(slave.id)
    slave.number_of_channels = slave.channels
    delete slave.channels

    slave.channels_list = _.map(
      slave.channels_list,
      channel => Object.assign({}, channel, channelsState.getChannelState(slave.id, channel.channel))
    )

    return slave
  })

  res.send(payload)
}

async function update (req, res, next) {
  const id = parseInt(req.params.id, 10)
  const ambients = req.body.ambients

  const transaction = await sequelize.transaction()

  try {
    const slave = await models.Slave.findOne({
      where: {
        id: id
      },
      transaction: transaction
    })

    if (!slave) {
      throw new Error('Slave not found')
    }

    const keys = _.keys(slave.toJSON())

    _.forEach(keys, key => {
      slave.set(key, req.body.slave[key])
    })

    await slave.save({
      transaction: transaction
    })

    await slave.setAmbients(ambients, {
      transaction: transaction
    })

    await transaction.commit()

    try {
      const tokenData = utils.getUserData(req.headers['x-access-token'])
      const user = tokenData.user_id

      await models.Logs.create({
        type: 'user_action',
        actionType: 'update_slave',
        slaveId: slave.id,
        user
      })
    } catch (e) {
      console.error('Could not create log!! Ignoring for now')
    }

    return res.send(slave)
  } catch (err) {
    transaction.rollback()

    return next({
      err: err.message,
      log: err
    })
  }
}

module.exports = {
  find,
  findAll,
  update,
  execute,
  setTemperature
}
