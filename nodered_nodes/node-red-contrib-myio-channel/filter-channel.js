module.exports = function (RED) {
  function FilterChannel (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!config.channels) return
      if (!msg.payload || msg.payload.message_type !== 'channel_update') return

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

      const ret = config.channels.map((channel) => {
        if (matchingRules.indexOf(channel) > -1) {
          return msg
        } else {
          return null
        }
      })

      node.send(ret)
    })
  }

  RED.nodes.registerType('filter-channel', FilterChannel)
}
