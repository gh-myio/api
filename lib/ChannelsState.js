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
        value: 0,
        input: 0,
        output: 0
      }, {
        id: 1,
        value: 0,
        input: 0,
        output: 0
      }, {
        id: 2,
        value: 0
      }]
    }

    const newState = currentState.map(state => {
      const newValue = _.find(data.channels, { id: state.id })

      if (newValue) {
        return {
          ...state,
          value: newValue.value,
          input: newValue.input,
          output: newValue.output
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
      return channel
    } else {
      return {
        value: 0,
        input: 0,
        output: 0
      }
    }
  }
}

module.exports = new ChannelsState()
