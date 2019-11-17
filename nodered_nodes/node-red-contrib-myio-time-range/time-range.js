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
      const now = new Date(1970, 1, 1, nowHour, nowMinute, 0)

      const matchingRules = comparators.filter((comparator) => {
        const [hour, minute] = comparator.value.split(':')
        const filterDate = new Date(1970, 1, 1, hour, minute, 0)

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
