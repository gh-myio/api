const models = require('../../models').Models
const _ = require('lodash')
const channelsState = require('../../ChannelsState')
const slaveState = require('../../SlaveState')
const infraredState = require('../../InfraredState')

async function findAll (req, res, next) {
  const slaves = await models.Slave.findAll({
    include: [{
      model: models.Channels,
      as: 'channels_list'
    }, {
      model: models.RfirDevices,
      as: 'devices'
    }]
  })

  const payload = slaves.map(slave => {
    slave = slave.toJSON()

    delete slave.channels
    if (slave.type === 'infrared') {
      delete slave.clamp_type

      slave.devices = slave.devices.map(device => {
        delete device.commandOnId
        delete device.commandOffId
        delete device.slaveId
        delete device.slave_id

        return device
      })

      slave.battery = infraredState.getSlaveBattery(slave.id)
      slave.temperature = infraredState.getSlaveTemperature(slave.id)
    } else {
      delete slave.devices

      slave.last_consumption = slaveState.getSlaveConsumption(slave.id)

      slave.channels = _.map(slave.channels_list, channel => {
        const value = channelsState.getChannelState(slave.id, channel.channel)
        channel.value = value
        channel.scene_id = channel.sceneId

        delete channel.channel_id
        delete channel.slaveId
        delete channel.slave_id
        delete channel.sceneId

        return channel
      })
    }

    delete slave.channels_list

    if (slave.type !== 'light_switch') {
      delete slave.color
    }

    slave.status = slaveState.getSlaveState(slave.id)

    return slave
  })

  res.send(payload)
}

module.exports = {
  findAll
}
