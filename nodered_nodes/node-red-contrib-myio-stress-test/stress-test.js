const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function StressTest (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      const slaveId = msg.payload.slave.id

      WebSocketHandler.send(JSON.stringify({
        type: 'slave',
        command: 'stress_test',
        id: slaveId,
        retries: msg.payload.retries || 100
      }))

      WebSocketHandler.once('stress_finished', (msg) => {
        node.send({
          payload: msg
        })
      })
    })
  }

  RED.nodes.registerType('stress-test', StressTest)
}
