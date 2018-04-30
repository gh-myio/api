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

    models.Scenes.find({
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

    models.Scenes.find({
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

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);

    sequelize.transaction()
        .then(transaction => {
            models.Scenes.find({
                where: {
                    id: id
                },
                transaction: transaction
            }) 
            .then(scene => {
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

                return scene.save({
                    transaction: transaction
                });
            })
            .then((scene) => {
                transaction.commit()
                    .then(() => {
                        ws.send(JSON.stringify({
                            type: 'admin',
                            command: 'scenes_updated'
                        }));
                        ;
                        return res.send(scene);
                    })
            }).catch((err) => {
                transaction.rollback()
                return res.send({
                    status: 500,
                    message: 'Error updating the scene.',
                    err: err.message
                });
            });
        });
}

function create(req, res, next) {
    req.body.json = req.body.json ? JSON.stringify(req.body.json) : req.body.json;

    sequelize.transaction()
        .then(transaction => {
            return models.Scenes.create(req.body, {
                transaction: transaction
            })
            .then(scene => {
                if (!scene) {
                    throw new Error('Unable to create the Scene');
                }

                transaction.commit()
                    .then(() => {
                        ws.send(JSON.stringify({
                            type: 'admin',
                            command: 'scenes_updated'
                        }));
                    });


                let json = scene.toJSON();
                if (typeof json.json === 'string') {
                    json.json = JSON.parse(json.json);
                }

                return res.send(scene);
            })
            .catch((err) => {
                console.log(err);
                transaction.rollback();
                res.send({
                    status: 500,
                    message: 'Error creating the scene',
                    err: err.message
                });
            });
        });
}

module.exports = {
    findAll: findAll,
    findById: findById,
    create: create,
    update: update,
    destroy: destroy
};
