const models = require('../../lib/models').Models

module.exports = function (RED) {
  function FilterSlave (config) {
    config.outputs = 3
    RED.nodes.createNode(this, config)

    const node = this

    node.outputs = config.slaves.length

    node.on('input', function (msg) {
      if (!config.slaves) return
      const slaveIndex = config.slaves.indexOf(`${msg.payload.id}`)
      if (slaveIndex < 0) return

      const output = config.slaves.map((slave, index) => {
        if (index === slaveIndex) {
          return msg
        }

        return null
      })

      node.send(output)
    })
  }

  RED.nodes.registerType('filter-slave', FilterSlave)
  RED.httpAdmin.get('/slaves', async (req, res) => {
    const slaves = await models.Slave.findAll({
      include: [{
        model: models.Channels,
        as: 'channels_list'
      }]
    })

    res.send(slaves)
  })
}