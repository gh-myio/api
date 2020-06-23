const models = require('../../lib/models').Models

function match (nodeContext, channels, msg) {
  const matchingRules = []

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
      case '>': matched = newChannelState > configChannel.value; break
      case '<': matched = newChannelState < configChannel.value; break
      case '==': matched = newChannelState === configChannel.value; break
    }

    if (matched) {
      matchingRules.push(configChannel)
    }

    nodeContext.set(key, newChannelState)
  })

  return matchingRules
}

function matchConsumption (nodeContext, consumption, msg) {
  const matchingRules = []

  consumption.forEach((configConsumption) => {
    let key = `${configConsumption.slave}_consumption`

    if (configConsumption.phase === 'Fase A') {
      key = `${configConsumption.slave}_consumption_phase_a`
    } else if (configConsumption.phase === 'Fase B') {
      key = `${configConsumption.slave}_consumption_phase_b`
    } else if (configConsumption.phase === 'Fase C') {
      key = `${configConsumption.slave}_consumption_phase_c`
    }

    const consumptionLastValue = nodeContext.get(key)

    let matched = false
    switch (configConsumption.compare) {
      case '>': matched = consumptionLastValue > configConsumption.value; break
      case '<': matched = consumptionLastValue < configConsumption.value; break
      case '==': matched = consumptionLastValue === configConsumption.value; break
    }

    if (matched) {
      matchingRules.push(configConsumption)
    }
  })

  return matchingRules
}

module.exports = function (RED) {
  function FilterChannelAnd (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!config.channels && !config.consumption) return

      if (msg.payload.message_type === 'consumption') {
        const update = msg.payload

        nodeContext.set(`${update.id}_consumption`, update.value)

        if (msg.payload.phases) {
          nodeContext.set(`${update.id}_consumption_phase_a`, update.phases.a)
          nodeContext.set(`${update.id}_consumption_phase_b`, update.phases.b)
          nodeContext.set(`${update.id}_consumption_phase_c`, update.phases.c)
        }

        return
      }

      const matchingChannels = match(nodeContext, config.channels, msg)
      const matchingOR = match(nodeContext, config.channelsOr, msg)
      const matchingConsumption = matchConsumption(nodeContext, config.consumption, msg)

      const alarmed = nodeContext.get('alarmed')
      const matchingChannelsLen = `${matchingChannels.length}/${config.channels.length}`
      const matchingConsumptionLen = `${matchingConsumption.length}/${config.consumption.length}`
      const matchingOrLen = `${matchingOR.length}`
      const filled = `${matchingChannelsLen} -  ${matchingConsumptionLen} - ${matchingOrLen}`

      const passing = (matchingChannels.length === config.channels.length) && (
        config.channelsOr.length === 0 || matchingOR.length > 0
      ) && config.consumption.length === matchingConsumption.length

      if (passing) {
        this.status({ fill: 'green', shape: 'dot', text: filled })

        if (alarmed && !config.stateChange) return

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
