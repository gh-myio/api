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
