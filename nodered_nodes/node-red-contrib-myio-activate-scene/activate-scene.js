const models = require('../../lib/models').Models

module.exports = function (RED) {
  function ActivateScene (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      delete msg._session

      msg.payload = {
        type: 'scene',
        command: 'activate',
        id: config.selectedScene
      }

      node.send(msg)
    })
  }

  RED.nodes.registerType('activate-scene', ActivateScene)

  RED.httpAdmin.get('/scenes', async (req, res) => {
    const scenes = await models.Scenes.findAll()

    res.send(scenes)
  })
}
