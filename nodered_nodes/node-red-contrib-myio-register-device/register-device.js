const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function RegisterDevice (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      if (!msg.payload) return

      const code = msg.payload.factory_address
        .replace(/ /g, '') // code (3, 5, 7, 8)
        .split(',').map(number => parseInt(number))

      const payload = {
        type: 'admin',
        command: 'add_slave',
        factory_address: code
      }

      const func = (message) => {
        if (message.command !== 'add_slave') return
        switch (message.status) {
          case 'success':
            models.Slave.scope('timestamps').findOne({
              where: {
                id: message.id
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
            }).then(slave => {
              msg.payload = {
                ...msg.payload,
                slave: slave.toJSON()
              }
              node.send([msg])
            })
            break
          case 'error':
            node.send([msg.payload = {
              ...msg.payload,
              error: message.message
            }])
            break
          case 'started':
          default:
            WebSocketHandler.once('admin', func)
            break
        }
      }

      WebSocketHandler.once('admin', func)
      WebSocketHandler.send(JSON.stringify(payload))
    })
  }

  RED.nodes.registerType('register-device', RegisterDevice)
}
