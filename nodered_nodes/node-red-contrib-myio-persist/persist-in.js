const { NodeRedPersist } = require('../../lib/models').Models;

module.exports = function (RED) {
  function PersistIn (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', async function (msg) {
      await NodeRedPersist.upsert({
        key: msg.payload.key,
        value: msg.payload.value
      })
    })
  }

  RED.nodes.registerType('persist-in', PersistIn)
}
