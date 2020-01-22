const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function SendCheck (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      const slaveId = msg.payload.slave.id

      WebSocketHandler.send(JSON.stringify({
        'type': 'slave',
        'command': 'check',
        'id': slaveId
      }))
    })
  }

  RED.nodes.registerType('send-check', SendCheck)
}
