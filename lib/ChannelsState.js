const _ = require('lodash')

class ChannelsState {
  constructor () {
    this.state = {}
  }

  addState (data) {
    let currentState = this.state[`slave_${data.id}`]

    if (!currentState) {
      currentState = [{
        id: 0,
        value: 0
      }, {
        id: 1,
        value: 0
      }, {
        id: 2,
        value: 0
      }]
    }

    const newState = currentState.map(state => {
      const newValue = _.find(data.channels, { id: state.id })

      console.log('Found new value: ', newValue)

      if (newValue) {
        return {
          ...state,
          value: newValue.value
        }
      } else {
        return state
      }
    })

    this.state[`slave_${data.id}`] = newState
  }

  getChannelState (slaveId, channelId) {
    const channels = this.state[`slave_${slaveId}`]
    const channel = _.find(channels, { id: channelId })

    if (!_.isUndefined(channel)) {
      console.log(`Got state: ${slaveId},${channelId}: ${channel.value}`)
      return channel.value
    } else {
      console.log(`Got state: ${slaveId},${channelId}: 0`)
      return 0
    }
  }
}

module.exports = new ChannelsState()
