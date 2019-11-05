const models = require('../../lib/models').Models

module.exports = function (RED) {
  function SlaveInfo (config) {
    RED.nodes.createNode(this, config)

    const slaves = await models.Slave.findAll({
      include: [{
        model: models.Channels,
        as: 'channels_list'
      }]
    })

    const node = this

    node.on('input', function (msg) {
      const slave = slaves.find(slave => slave.id === msg.payload.id)

      if (!slave) return

      msg.slaveInfo = slave.toJSON()

      node.send(msg)
    })
  }

  RED.nodes.registerType('slave-info', SlaveInfo)
}
