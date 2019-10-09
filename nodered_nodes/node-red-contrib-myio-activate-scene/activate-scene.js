const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function ActivateScene (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      WebSocketHandler.send(JSON.stringify({
        type: 'scene',
        command: 'activate',
        id: config.selectedScene
      }))
    })
  }

  RED.nodes.registerType('activate-scene', ActivateScene)

  RED.httpAdmin.get('/scenes', async (req, res) => {
    const scenes = await models.Scenes.findAll()

    res.send(scenes)
  })
}
