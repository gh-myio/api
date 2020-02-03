module.exports = function (RED) {
  function FilterConsumption (config) {
    RED.nodes.createNode(this, config)

    const node = this
    let filterValue

    node.on('input', function (msg) {
      if (!config.consumptions) return
      if (msg.payload && msg.payload.message_type === 'set_value') {
        filterValue = msg.payload.value
        console.log('SETTING FILTER VALUE TO ', msg.payload.value)

        this.status({ fill: 'green', shape: 'ring', text: filterValue })

        return
      }

      if (!msg.payload || msg.payload.message_type !== 'consumption') return

      if (filterValue) {
        const comparator = filterValue.split(' ')[0]
        const value = parseInt(filterValue.split(' ')[1])

        console.log('filter-consumption', msg.payload.value, comparator, value)

        switch (comparator) {
          case '>':
            console.log('>')
            if (msg.payload.value > value) {
              console.log('true')
              node.send(msg)
              return
            }
            break
          case '<':
            console.log('<')
            if (msg.payload.value < value) {
              console.log('true')
              node.send(msg)

              return
            }
            break
          case '==':
            console.log('==')
            if (msg.payload.value === value) {
              console.log('true')
              node.send(msg)

              return
            }
            break
        }

        return
      } else {
        console.log('NO FILTER VALUE !! ', filterValue)
      }

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
