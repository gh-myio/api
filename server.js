'use strict';

const restify = require('restify'),
      plugins = require('restify-plugins'),
      db      = require('./lib/models'),
      swagger = require('swagger-restify');


let server = restify.createServer({
  name: 'Hubot',
  version: '0.0.1'
});

server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

server = require('./lib/routes')(server);
swagger.init(server, {
    apiVersion: '1.0',
    swaggerVersion: '1.0', // or '1.2'
    basePath: 'http://localhost:8080',
    info: {
        title: 'Hubot Home API',
        description: 'Hubot Swagger'
    },
    apis: ['./lib/routes/index.js'],
    // swagger-restify specific configuration
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public'
});

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
