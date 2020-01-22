const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function ActivateChannel (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      if (!config.channels) return

      let time = 500

      config.channels.forEach((channel) => {
        let payload = {}

        if (channel.slave === 'generic') {
          payload = {
            type: 'slave',
            id: msg.payload.slave.id,
            command: 'light_control',
            channel: channel.channel,
            value: channel.value
          }
        } else {
          if (channel.value === 'pulse_up' || channel.value === 'pulse_down') {
            const value = channel.value === 'pulse_up' ? 100 : 0

            payload = {
              type: 'slave',
              id: channel.slave,
              command: 'pulse',
              channel: channel.channel,
              value: value
            }
          } else {
            payload = {
              type: 'slave',
              id: channel.slave,
              command: 'light_control',
              channel: channel.channel,
              value: channel.value
            }
          }
        }

        console.log(payload)

        setTimeout(() => {
          WebSocketHandler.send(JSON.stringify(payload))
        }, time)

        time += 500
      })
    })
  }

  RED.nodes.registerType('activate-channel', ActivateChannel)

  RED.httpAdmin.get('/slaves', async (req, res) => {
    const slaves = await models.Slave.findAll({
      include: [{
        model: models.Channels,
        as: 'channels_list'
      }]
    })

    res.send(slaves)
  })
}
