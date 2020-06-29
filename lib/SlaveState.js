class SlaveState {
  constructor () {
    this.state = {}
  }

  addState (data) {
    this.state[`slave_${data.id}`] = data.status
  }

  addConsumption (data) {
    this.state[`slave_${data.id}_consumption`] = data.value
  }

  addTemperature (data) {
    if (data.value && data.value !== 255) {
      this.state[`slave_${data.id}_temperature`] = data.value
    }
  }

  addPulseState (data) {
    this.state[`slave_${data.id}_pulses`] = data.channels
  }

  getPulseState (slaveId) {
    return  this.state[`slave_${slaveId}_pulses`]
  }

  getSlaveTemperature (slaveId) {
    const temperature = this.state[`slave_${slaveId}_temperature`]

    return temperature
  }

  getSlaveConsumption (slaveId) {
    const consumption = this.state[`slave_${slaveId}_consumption`]

    return consumption || 0
  }

  getSlaveState (slaveId) {
    const status = this.state[`slave_${slaveId}`]

    if (status) {
      return status
    } else {
      return 'waiting'
    }
  }
}

module.exports = new SlaveState()
