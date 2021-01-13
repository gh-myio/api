const _ = require('lodash')

class ChannelsState {
  constructor () {
    this.state = {}
  }

  addState (data) {
    this.state[`slave_${data.id}`] = data.channels
  }

  getChannelState (slaveId, channelId) {
    const channels = this.state[`slave_${slaveId}`]
    const channel = _.find(channels, { id: channelId }) || {
      value: 0,
      input: 0,
      output: 0
    }
    return _.omit(channel, ['id'])
  }
}

module.exports = new ChannelsState()
