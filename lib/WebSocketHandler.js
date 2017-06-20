'use strict';

const WebSocket = require('ws'),
      config    = require('./config');

const channelsState = require('./ChannelsState');
const infraredState = require('./InfraredState');
 
class WebSocketHandler {
    constructor() {
        this.setup();
    }

    send(data) {
        if (this.connected) {
            this.socket.send(data);
        } else {
            console.log('Cannot send, not connected');
        }
    }

    reconnect() {
        console.log('Reconnecting...');
        this.reconnectInterval = setTimeout(() => {
            this.setup();
        }, 500);
    }

    onError(err) {
        console.log('error', err);
    }

    onOpen() {
        console.log('Connected to erlang app');
        this.connected = true;
        if (this.reconnectInterval) {
            console.log('Cleared reconnect');
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = undefined;
        }
    }

    onMessage(message) {
        let data = JSON.parse(message);

        if (data.message_type && data.message_type === 'channel_update') {
            channelsState.addState(data);
        }

        if (data.message_type && data.message_type === 'infrared_update') {
            infraredState.addState(data);
        }
    }

    onClose() {
        this.connected = false;
        console.log('Websocket disconnected, retrying');
        this.reconnect();
    }

    setup() {
        try {
            this.socket = new WebSocket(config.ws, {
                perMessageDeflate: false
            });

            this.socket.on('open', this.onOpen.bind(this));
            this.socket.on('message', this.onMessage.bind(this));
            this.socket.on('close', this.onClose.bind(this));
            this.socket.on('error', this.onError.bind(this));
        } catch(e) {
            console.log('CATCH');
            this.reconnect();
        }
    }

}

module.exports = new WebSocketHandler();
