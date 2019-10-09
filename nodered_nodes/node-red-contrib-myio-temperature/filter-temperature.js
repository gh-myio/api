module.exports = function (RED) {
  function FilterTemperature (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      if (!config.temperatures) return
      if (!msg.payload || msg.payload.message_type !== 'infrared_update') return

      const comparators = config.temperatures

      const matchingRules = comparators.filter((comparator) => {
        switch (comparator.compare) {
          case '>': return msg.payload.temperature > comparator.value
          case '<': return msg.payload.temperature < comparator.value
          case '==': return msg.payload.temperature === comparator.value
        }
      })

      const ret = config.temperatures.map((temperature) => {
        if (matchingRules.indexOf(temperature) > -1) {
          return msg
        } else {
          return null
        }
      })

      node.send(ret)
    })
  }

  RED.nodes.registerType('filter-temperature', FilterTemperature)
}
