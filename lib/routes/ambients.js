'use strict';

const models        = require('../models').Models,
    sequelize       = require('../models').sequelize,
    Sequelize       = require('sequelize'),
    Promise         = require('bluebird'),
    _               = require('lodash'),
    jwt             = require('jsonwebtoken'),
    utils           = require('../utils');

let Op = Sequelize.Op;

async function findAll(req, res, next) {
    let token = req.headers['x-access-token']
    let allowedAmbientList = await utils.getUserAllowedAmbients(token)

    let query = {
        where: {
            id: {
                [Op.in]: allowedAmbientList
            }
        },
        include: [{
            model: models.Slave,
            attributes: [
                'id',
                'type',
                'addr_low',
                'addr_high',
                'channels',
                'name',
                'description'
            ]
        }]
    }

    let ambients = await models.Ambients.findAll(query)

    if (!ambients) {
        return res.send([]);
    }

    return res.send(ambients);
}

function findById(req, res, next) {
    let id = req.params.id;

    models.Ambients.findOne({
        where: {
            id: id
        }
    })
        .then(ambients => {
            if (!ambients) {
                return next({
                    status: 404,
                    message: 'Ambient not found'
                });
            }

            return res.send(ambients);
        })
        .catch((err) => {
            return next({
                err: err,
                log: err
            });
        });
}

async function destroy(req, res, next) {
    /*if (utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    }*/

    let id = req.params.id;

    let ambient = await models.Ambients.findOne({
        where: {
            id: id
        }
    })

    if (!ambient) {
        return next({
            status: 404,
            message: 'Ambient not found'
        });
    }

    ambient.destroy()
        .then(() => {
            return res.send({
                status: 200,
                message: 'Ambient destroyed.'
            });
        });
}

function update(req, res, next) {
    if (!utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    }

    let id = parseInt(req.params.id, 10);
    let slaves = req.body.slaves;
    delete req.body.slaves;

    if (!slaves) {
        slaves = [];
    }

    sequelize.transaction()
        .then(transaction => {
            models.Ambients.findOne({
                where: {
                    id: id
                },
                transaction: transaction
            })
                .then(ambient => {
                    if (!ambient) {
                        throw new Error('Ambient not found');
                    }

                    let keys = _.keys(req.body);
                    _.forEach(keys, key => {
                        console.log(`setting ${key} => ${req.body[key]}`);
                        ambient.set(key, req.body[key]);
                    });

                    return ambient.save({
                        transaction: transaction
                    });
                })
                .then((ambient) => {
                    return ambient.setSlaves([], {
                        transaction: transaction
                    })
                        .then(() => {
                            return models.Slave.findAll({
                                where: {
                                    id: {
                                        [Op.in]: slaves
                                    }
                                },
                                transaction: transaction
                            })
                                .then(_slaves => {
                                    if (_slaves.length < slaves.length) {
                                        throw new Error('Slave not found in list');
                                    }

                                    return Promise.all(_.map(_slaves, slave => {
                                        return slave.addAmbient(ambient, {
                                            transaction: transaction
                                        });
                                    }))
                                        .then(() => {
                                            return ambient;
                                        });
                                });
                        });
                })
                .then((ambient) => {
                    transaction.commit();
                    return res.send(ambient);
                })
                .catch((err) => {
                    return next({
                        err: err.message,
                        log: err
                    });
                });
        });
}

function create(req, res, next) {
    if (!utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    }

    let name = req.body.name;
    let slaves = req.body.slaves;
    if (!slaves) {
        slaves = [];
    }

    sequelize.transaction()
        .then(transaction => {
            return models.Ambients.create({
                name: name
            }, {
                transaction: transaction
            })
                .then(ambient => {
                    if (!ambient) {
                        return next({
                            status: 500,
                            message: 'Error creating the ambient'
                        });
                    }

                    return models.Slave.findAll({
                        where: {
                            id: {
                                [Op.in]: slaves
                            }
                        },
                        transaction: transaction
                    })
                        .then(_slaves => {
                            if (_slaves.length < slaves.length) {
                                throw new Error('Slave not found in list');
                            }

                            return Promise.all(_.map(_slaves, slave => {
                                return slave.addAmbient(ambient, {
                                    transaction: transaction
                                });
                            }))
                                .then(() => {
                                    return ambient;
                                });
                        });
                })
                .then((ambient) => {
                    transaction.commit();
                    res.send(ambient);
                })
                .catch((err) => {
                    console.log(err);
                    transaction.rollback();
                    return next({
                        err: err.message,
                        log: err
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
