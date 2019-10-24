const models = require('../../lib/models').Models

function match(channels, msg) {
  let matchingRules = []

  channels.forEach((configChannel) => {
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

  return matchingRules
}

module.exports = function (RED) {
  function FilterChannelAnd (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!config.channels) return

      const matchingChannels = match(config.channels, msg)
      const matchingOR = match(config.channelsOr, msg)

      const alarmed = nodeContext.get('alarmed')
      const filled = `${matchingChannels.length}/${config.channels.length}`

      const passing = (matchingRules.length === config.channels.length) && (
        config.channelsOr === 0 || matchingOR.length > 0
      )

      if (passing) {
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
