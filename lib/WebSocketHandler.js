'use strict'

let WebSocket       = require('ws'),
        config      = require('./config'),
        jwt         = require('jsonwebtoken'),
        sequelize   = require('./models').sequelize,
        models      = require('./models').Models

let channelsState = require('./ChannelsState')
let infraredState = require('./InfraredState')
let slaveState = require('./SlaveState')

class WebSocketHandler {
    constructor() {
        this.setup()
    }

    send(data) {
        if (this.connected) {
            this.socket.send(data)
        } else {
            console.log('Cannot send, not connected')
        }
    }

    reconnect() {
        console.log('Reconnecting...')
        this.reconnectInterval = setTimeout(() => {
            this.setup()
        }, 500)
    }

    onError(err) {
        console.log('error', err)
    }

    onOpen() {
        console.log('Connected to erlang app')
        this.connected = true
        if (this.reconnectInterval) {
            console.log('Cleared reconnect')
            clearInterval(this.reconnectInterval)
            this.reconnectInterval = undefined
        }
    }

    onMessage(message) {
        let data = JSON.parse(message)

        if (data.message_type && data.message_type == 'auth_req') {
            console.log('Auth req received, sending auth')

            let token = jwt.sign({
                UUID: '92e916b9-9517-4c88-853d-9c9f6f052afe'
            }, global.privKey)

            this.socket.send(JSON.stringify({
                'message_type': 'auth',
                'token': token
            }))
        }

        if (data.message_type && data.message_type === 'channel_update') {
            channelsState.addState(data)
        }

        if (data.message_type && data.message_type === 'infrared_update') {
            infraredState.addState(data)
        }

        if (data.message_type && data.message_type === 'status_update') {
            slaveState.addState(data)
        }

        if (data.message_type && data.message_type === 'alarm_state') {
            let slaveId = data.id;
            let value0 = data.sensors.alarm_one;
            let value1 = data.sensors.alarm_two;

            models.Alarm.findOne({
                where: {
                    slave_id: slaveId,
                    channel: 0
                },
                order: [ [ 'created', 'DESC' ]],
            }).then(alarm0 => {
                if (alarm0) {
                    alarm0 = alarm0.toJSON();
                }
                if (!alarm0 || alarm0.value != value0) {
                    sequelize.transaction()
                        .then((transaction) =>
                            models.Alarm.create(
                                {'slave': slaveId, 'channel': 0, 'last_event': (alarm0 != null ? alarm0.id : null), 'value': value0}
                            )
                            .then(transaction.commit()));
                }
            });

            models.Alarm.findOne({
                where: {
                    slave_id: slaveId,
                    channel: 1
                },
                order: [ [ 'created', 'DESC' ]],
            }).then(alarm1 => {
                if (alarm1) {
                    alarm1 = alarm1.toJSON();
                }
                if (!alarm1 || alarm1.value != value1) {
                    sequelize.transaction()
                        .then((transaction) =>
                            models.Alarm.create(
                                {'slave': slaveId, 'channel': 1, 'last_event': (alarm1 != null ? alarm1.id : null), 'value': value1}
                            )
                            .then(transaction.commit()));
                }
            });
        }
    }

    onClose() {
        this.connected = false
        console.log('Websocket disconnected, retrying')
        this.reconnect()
    }

    setup() {
        try {
            this.socket = new WebSocket(config.ws, {
                perMessageDeflate: false
            })

            this.socket.on('open', this.onOpen.bind(this))
            this.socket.on('message', this.onMessage.bind(this))
            this.socket.on('close', this.onClose.bind(this))
            this.socket.on('error', this.onError.bind(this))
        } catch(e) {
            console.log('CATCH')
            this.reconnect()
        }
    }

}

module.exports = new WebSocketHandler()
