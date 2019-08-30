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
    const channel = _.find(channels, { id: channelId })

    if (channel) {
      return channel.value
    } else {
      return 0
    }
  }
}

module.exports = new ChannelsState()
