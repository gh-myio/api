'use strict';

const restify       = require('restify'),
      plugins       = require('restify-plugins'),
      db            = require('./lib/models'),
      WebSocket     = require('ws'),
      config        = require('./lib/config');

const channelsState = require('./lib/ChannelsState');
const infraredState = require('./lib/InfraredState');
 
let server = restify.createServer({
  name: 'Hubot',
  version: '0.0.1'
});

server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
server = require('./lib/routes')(server);

// Error handling middleware
server.use((err, req, res, next) => {
    console.log('Error handling..', err);
    let status  = err.status || 500,
        message = err.message || 'There was an error processing the request';

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
    console.log('%s listening at %s', server.name, server.url);
});

let ws = undefined;

function connectWS() {
        let ws = new WebSocket(config.ws, {
            perMessageDeflate: false
        });

	ws.on('error', function() {
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

