const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function MyioEmitter (config) {
    RED.nodes.createNode(this, config)

    const node = this

    /* 1) channel_update
     * 2) infrared_update
     * 3) consumption
     */

    WebSocketHandler.on('channel_update', (msg) => {
      node.send([{
        payload: msg
      }, null, null])
    })

    WebSocketHandler.on('infrared_update', (msg) => {
      node.send([null, {
        payload: msg
      }, null])
    })

    WebSocketHandler.on('consumption', (msg) => {
      if (msg.scope === 'all') return

      node.send([null, null, {
        payload: msg
      }])
    })
  }

  RED.nodes.registerType('myio-emitter', MyioEmitter)
}
