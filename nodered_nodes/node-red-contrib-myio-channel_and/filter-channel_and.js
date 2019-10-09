const models = require('../../lib/models').Models

module.exports = function (RED) {
  function FilterChannelAnd (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!config.channels) return

      const matchingRules = []

      msg.payload.channels.forEach((msgChannel) => {
        const key = `${msg.payload.message_type}_${msg.payload.id}_${msgChannel.id}`
        /* Check for channel state change */
        const channelState = nodeContext.get(key)

        if (channelState === msgChannel.value && config.deveMudar) return

        const comparators = config.channels.filter(channel => {
          return channel.channel === msgChannel.id
        })

        const matched = comparators.filter((comparator) => {
          switch (comparator.compare) {
            case '>': return msgChannel.value > comparator.value
            case '<': return msgChannel.value < comparator.value
            case '==': return msgChannel.value === comparator.value
          }
        })

        matched.forEach(match => {
          matchingRules.push(match)
        })

        nodeContext.set(key, msgChannel.value)
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
