'use strict';

const express       = require('express'),
      plugins       = require('restify-plugins'),
      db            = require('./lib/models'),
      WebSocket     = require('ws'),
      config        = require('./lib/config'),
      bodyParser    = require('body-parser');

const channelsState = require('./lib/ChannelsState');
const infraredState = require('./lib/InfraredState');
 
let server = express();

server.use(bodyParser.json());
server = require('./lib/routes')(server);

// Error handling middleware
server.use((err, req, res, next) => {
    console.log('Error handling..', err);
    let status  = err.status || 500,
        message = err.err || 'There was an error processing the request';

    if (err && err.log) {
        console.log('Logging error');
        console.log(err.log);
    }

    res.status(status);
    res.send({
        status: status,
        message: message
    });
});

server.listen(8080, function () {
    console.log('%s listening at 8080', server.name);
});

let ws = undefined;

function connectWS() {
    let ws = new WebSocket(config.ws, {
        perMessageDeflate: false
    });

    ws.on('error', () => {
        setTimeout(() => {
            console.log('Retrying WS connection..');
            connectWS();
        }, 5000);
    });

    ws.on('message', (message, flags) => {
        let data = JSON.parse(message);

        if (data.message_type && data.message_type === 'channel_update') {
            channelsState.addState(data);
        }

        if (data.message_type && data.message_type === 'infrared_update') {
            infraredState.addState(data);
        }
    });
}

connectWS();

