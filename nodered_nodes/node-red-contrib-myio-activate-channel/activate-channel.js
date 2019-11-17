const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function ActivateChannel (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!config.channels) return

      let time = 0

      config.channels.forEach((channel) => {
        const payload = {
          type: 'slave',
          id: channel.slave,
          command: 'light_control',
          channel: channel.channel,
          value: channel.value
        }

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
