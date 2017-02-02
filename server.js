'use strict';

const restify = require('restify'),
      plugins = require('restify-plugins'),
      db      = require('./lib/models');


const server = restify.createServer({
  name: 'Hubot',
  version: '0.0.1'
});

server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

server.get('/scenes', function (req, res, next) {
    db.Scenes.find()
        .then((scenes) => {
            if (!scenes) {
                return res.send([]);
            }

            res.send(scenes);
        }, err => {
            res.send(err);
        });
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
