class InfraredState {
  constructor () {
    this.state = {}
  }

  addState (data) {
    this.state[`slave_${data.id}`] = data
  }

  getSlaveTemperature (slaveId) {
    const ir = this.state[`slave_${slaveId}`]

    if (ir && ir.temperature) {
      return ir.temperature
    } else {
      return -1
    }
  }

  getSlaveBattery (slaveId) {
    const ir = this.state[`slave_${slaveId}`]

    if (ir && ir.battery) {
      return ir.battery
    } else {
      return -1
    }
  }
}

module.exports = new InfraredState()
