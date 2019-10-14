const models = require('../../lib/models').Models

module.exports = function (RED) {
  function FilterChannelAnd (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!config.channels) return

      const matchingRules = []

      config.channels.forEach((configChannel) => {
        const key = `${msg.payload.message_type}_${configChannel.slave}_${configChannel.channel}`
        const oldChannelState = nodeContext.get(key)
        let newChannelState

        if (configChannel.slave !== msg.payload.id) {
          newChannelState = oldChannelState
        } else {
          /* Check for channel state change */
          newChannelState = msg.payload.channels.find(ch => ch.id === configChannel.channel).value
        }

        let matched = false
        switch (configChannel.compare) {
          case '>': matched = newChannelState > configChannel.value; break;
          case '<': matched = newChannelState < configChannel.value; break;
          case '==': matched = newChannelState === configChannel.value; break;
        }

        if (matched) {
          matchingRules.push(configChannel);
        }

        nodeContext.set(key, newChannelState);
      })

      const alarmed = nodeContext.get('alarmed')
      const filled = `${matchingRules.length}/${config.channels.length}`

      if (matchingRules.length === config.channels.length) {
        this.status({ fill: 'green', shape: 'dot', text: filled })

        if (alarmed) return

        nodeContext.set('alarmed', true)

        node.send(msg)
      } else {
        nodeContext.set('alarmed', false)

        this.status({ fill: 'red', shape: 'dot', text: filled })
      }
    })
  }

  RED.nodes.registerType('filter-channel_and', FilterChannelAnd)

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
