'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      _             = require('lodash'),
      ws            = require('../WebSocketHandler');

function findAll(req, res, next) {
    models.Scenes.findAll()
        .then(scenes => {
            if (!scenes) {
                return res.send([]);
            }

            let json = _.map(scenes, scene => {
                let s = scene.toJSON();
                if (typeof s.json === 'string') {
                    s.json = JSON.parse(s.json);
                }

                return s;
            });

            return res.send(json);
        });
}

function findById(req, res, next) {
    let id = req.params.id;

    models.Scenes.findOne({
        where: {
            id: id
        }
    })
    .then(scene => {
        if (!scene) {
            return res.send({
                status: 404,
                message: 'Scene not found'
            });
        }

        return res.send(scene);
    });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.Scenes.findOne({
        where: {
            id: id
        }
    })
    .then(scene => {
        if (!scene) {
            return res.send({
                status: 404,
                message: 'Scene not found'
            });
        }

        scene.destroy()
            .then(() => {
                ws.send(JSON.stringify({
                    type: 'admin',
                    command: 'scenes_updated'
                }));
                return res.send({
                    status: 200,
                    message: 'Scene destroyed.'
                });
            });
    });
}

async function update(req, res, next) {
    let id = parseInt(req.params.id, 10);

    console.log(req.body)
    try {
        let result = sequelize.transaction(async (transaction) => {
            let scene = await models.Scenes.findOne({
                where: {
                    id: id
                },
                transaction: transaction
            })

            if (!scene) {
                throw new Error('Scene not found');
            }

            let keys = _.keys(req.body);

            _.forEach(keys, key => {
                let data = req.body[key];
                if (key === 'json' && typeof data === 'object') {
                    data = JSON.stringify(data);
                }

                scene.set(key, data);
            });

            await scene.save({
                transaction: transaction
            });

            await scene.reload({
                transaction: transaction
            })

            ws.send(JSON.stringify({
                type: 'admin',
                command: 'scenes_updated'
            }));

            return res.send(scene);
        })
    } catch(err) {
        return res.send({
            status: 500,
            message: 'Error updating the scene.',
            err: err.message
        });
    }
}

async function create(req, res, next) {
    req.body.json = req.body.json ? JSON.stringify(req.body.json) : req.body.json;

    console.log(req.body)

    try {
        let result = sequelize.transaction(async (transaction) => {
            let scene = models.Scenes.create(req.body, {
                transaction: transaction
            })

            if (!scene) {
                throw new Error('Unable to create the Scene');
            }

            ws.send(JSON.stringify({
                type: 'admin',
                command: 'scenes_updated'
            }));

            let json = scene.toJSON();

            if (typeof json.json === 'string') {
                json.json = JSON.parse(json.json);
            }

            return res.send(scene);
        })
    } catch(err) {
        res.send({
            status: 500,
            message: 'Error creating the scene',
            err: err.message
        });
    }

}

module.exports = {
    findAll: findAll,
    findById: findById,
    create: create,
    update: update,
    destroy: destroy
};
