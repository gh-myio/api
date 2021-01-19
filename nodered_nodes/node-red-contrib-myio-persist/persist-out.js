const { NodeRedPersist } = require('../../lib/models').Models

module.exports = function (RED) {
  function PersistOut (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', async function (msg) {
      const result = await NodeRedPersist.findOne({
        where: {
          key: msg.payload.key
        }
      })

      if (!result) return

      node.send({
        payload: result.value
      })
    })
  }

  RED.nodes.registerType('persist-out', PersistOut)
}
