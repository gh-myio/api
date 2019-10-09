module.exports = function (RED) {
  function FilterConsumption (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      if (!config.consumptions) return
      if (!msg.payload || msg.payload.message_type !== 'consumption') return

      const comparators = config.consumptions

      const matchingRules = comparators.filter((comparator) => {
        switch (comparator.compare) {
          case '>': return msg.payload.value > comparator.value
          case '<': return msg.payload.value < comparator.value
          case '==': return msg.payload.value === comparator.value
        }
      })

      const ret = config.consumptions.map((consumption) => {
        if (matchingRules.indexOf(consumption) > -1) {
          return msg
        } else {
          return null
        }
      })

      node.send(ret)
    })
  }

  RED.nodes.registerType('filter-consumption', FilterConsumption)
}
