const models = require('../../lib/models').Models

module.exports = function (RED) {
  function FilterSlave (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      if (!config.timeRanges) return

      const comparators = config.timeRanges

      const today = new Date()
      const nowHour = today.getHours()
      const nowMinute = today.getMinutes()
      const now = new Date(1970, 01, 01, nowHour, nowMinute, 00);

      const matchingRules = comparators.filter((comparator) => {
        let [hour, minute] = comparator.value.split(':')
        let filterDate = new Date(1970, 01, 01, hour, minute, 00);

        if (comparator.compare === '==') {
          return now.getTime() === filterDate.getTime()
        } else if (comparator.compare === '>') {
          return now.getTime() > filterDate.getTime()
        } else if (comparator.compare === '<') {
          return now.getTime() < filterDate.getTime()
        }
      })

      if (matchingRules.length === config.timeRanges.length) {
        if (config.days.indexOf(`${today.getDay()}`) < 0) return

        node.send(msg)
      }

    })
  }

  RED.nodes.registerType('time-range', FilterSlave)
}
