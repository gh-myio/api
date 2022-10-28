const models = require('../../lib/models').Models

module.exports = function (RED) {
  function GetData (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', async function (msg) {
      if (config.selectedOption === 'slaves') {
        const slaves = await models.Slave.findAll({
          include: [{
            model: models.Channels,
            as: 'channels_list'
          }]
        })

        node.send({
          ...msg,
          payload: slaves
        })
      }

      if (config.selectedOption === 'scenes') {
        const scenes = await models.Scenes.findAll()

        node.send({
          ...msg,
          payload: scenes
        })
      }
    })
  }

  RED.nodes.registerType('get-data', GetData)
}
