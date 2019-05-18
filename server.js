'use strict';

let express         = require('express'),
      db            = require('./lib/models'),
      config        = require('./lib/config'),
      bodyParser    = require('body-parser');
  //     compression   = require('compression')

let channelsState = require('./lib/ChannelsState');
let infraredState = require('./lib/InfraredState');
let slaveState = require('./lib/SlaveState');
let ws            = require('./lib/WebSocketHandler');
let Scheduler     = require('./scheduler');

Scheduler.setSocket(ws)
Scheduler.prepare()

let server = express();

let fs              = require('fs')

if (process.env.PRIVATE_KEY) {
    try {
        //let config = JSON.parse(fs.readFileSync(process.env.CONFIG_PATH, 'utf-8'))

        global.privKey     = process.env.PRIVATE_KEY;
    } catch(e) {
        console.error(e)
        process.exit(1)
    }
} else {
    console.error('Fatal: Private key not defined in env.')
    process.exit(1)
}

server.use(bodyParser.json());
//server.use(compression())
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

