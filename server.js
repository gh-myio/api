'use strict';

let express       = require('express'),
      plugins       = require('restify-plugins'),
      db            = require('./lib/models'),
      config        = require('./lib/config'),
      bodyParser    = require('body-parser');

let channelsState = require('./lib/ChannelsState');
let infraredState = require('./lib/InfraredState');
let ws            = require('./lib/WebSocketHandler');
 
let server = express();

let fs              = require('fs')

if (fs.existsSync(process.env.CONFIG_PATH)) {
    try {
        let config = JSON.parse(fs.readFileSync(process.env.CONFIG_PATH, 'utf-8'))

        global.privKey     = config.privKey
    } catch(e) {
        console.error(e)
        process.exit(1)
    }
} else {
    console.error('Fatal: Config file not in directory.')
    process.exit(1)
}

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

