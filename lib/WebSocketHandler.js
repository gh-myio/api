const WebSocket = require('ws')
const config = require('./config')
const jwt = require('jsonwebtoken')
const sequelize = require('./models').sequelize
const models = require('./models').Models

const channelsState = require('./ChannelsState')
const infraredState = require('./InfraredState')
const slaveState = require('./SlaveState')
const EventEmitter = require('events')

class WebSocketHandler extends EventEmitter {
  constructor () {
    super()

    this.setup()
  }

  send (data) {
    if (this.connected) {
      this.socket.send(data)
    } else {
      console.log('Cannot send, not connected')
    }
  }

  reconnect () {
    console.log('Reconnecting...')
    this.reconnectInterval = setTimeout(() => {
      this.setup()
    }, 500)
  }

  onError (err) {
    console.log('error', err)
  }

  onOpen () {
    console.log('Connected to erlang app')
    this.connected = true

    if (this.reconnectInterval) {
      console.log('Cleared reconnect')
      clearInterval(this.reconnectInterval)
      this.reconnectInterval = undefined
    }
  }

  async subscribeConsumption () {
    const slaves = await models.Slave.findAll()
    slaves.forEach(slave => {
      this.send(JSON.stringify({
        type: 'consumption',
        command: 'subscribe',
        scope: 'slave',
        id: slave.id
      }))
    })
  }

  onMessage (message) {
    const data = JSON.parse(message)

    if (data.message_type && data.message_type === 'auth_req') {
      console.log('Auth req received, sending auth')

      const token = jwt.sign({
        UUID: '92e916b9-9517-4c88-853d-9c9f6f052afe'
      }, global.privKey)

      this.socket.send(JSON.stringify({
        message_type: 'auth',
        token: token
      }))
    }

    if (data.message_type && data.message_type === 'auth_success') {
      this.subscribeConsumption()
    }

    if (data.message_type && data.message_type === 'channel_update') {
      channelsState.addState(data)
    }

    if (data.message_type && data.message_type === 'infrared_update') {
      infraredState.addState(data)
    }

    if (data.message_type && data.message_type === 'consumption' && data.scope === 'slave') {
      slaveState.addConsumption(data)
    }

    if (data.message_type && data.message_type === 'status_update') {
      slaveState.addState(data)
    }

    if (data.message_type && data.message_type === 'alarm_state') {
      const slaveId = data.id
      const value0 = data.sensors.alarm_one
      const value1 = data.sensors.alarm_two

      models.Alarm.findOne({
        where: {
          slave_id: slaveId,
          channel: 0
        },
        order: [['created', 'DESC']]
      }).then(alarm0 => {
        if (alarm0) {
          alarm0 = alarm0.toJSON()
        }

        if (!alarm0 || alarm0.value !== value0) {
          sequelize.transaction()
            .then((transaction) =>
              models.Alarm.create(
                { slave: slaveId, channel: 0, last_event: (alarm0 != null ? alarm0.id : null), value: value0 }
              )
                .then(transaction.commit()))
        }
      })

      models.Alarm.findOne({
        where: {
          slave_id: slaveId,
          channel: 1
        },
        order: [['created', 'DESC']]
      }).then(alarm1 => {
        if (alarm1) {
          alarm1 = alarm1.toJSON()
        }
        if (!alarm1 || alarm1.value !== value1) {
          sequelize.transaction()
            .then((transaction) =>
              models.Alarm.create(
                { slave: slaveId, channel: 1, last_event: (alarm1 != null ? alarm1.id : null), value: value1 }
              )
                .then(transaction.commit()))
        }
      })
    }

    try {
      if (data.message_type === 'error') return

      this.emit(data.message_type, data)
    } catch(e) {
      console.error('Catched error on emit: ', e)
    }
  }

  onClose () {
    this.connected = false
    console.log('Websocket disconnected, retrying')
    this.reconnect()
  }

  setup () {
    try {
      this.socket = new WebSocket(config.ws, {
        perMessageDeflate: false
      })

      this.socket.on('open', this.onOpen.bind(this))
      this.socket.on('message', this.onMessage.bind(this))
      this.socket.on('close', this.onClose.bind(this))
      this.socket.on('error', this.onError.bind(this))
    } catch (e) {
      console.log('CATCH')
      this.reconnect()
    }
  }
}

module.exports = new WebSocketHandler()
