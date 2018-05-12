'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      _             = require('lodash');

function findAll(req, res, next) {
    models.RfirButtons.findAll()
        .then(buttons => {
            if (!buttons) {
                return res.send([]);
            }

            let json = _.map(buttons, button => {
                let s = button.toJSON();
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

    models.RfirButtons.find({
        where: {
            id: id
        }
    })
    .then(button => {
        if (!button) {
            return res.send({
                status: 404,
                message: 'Button not found'
            });
        }

        return res.send(button);
    });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.RfirButtons.find({
        where: {
            id: id
        }
    })
    .then(button => {
        if (!button) {
            return res.send({
                status: 404,
                message: 'Button not found'
            });
        }

        button.destroy()
            .then(() => {
                return res.send({
                    status: 200,
                    message: 'Button destroyed.'
                });
            });
    });
}

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);

    sequelize.transaction()
        .then(transaction => {
            models.RfirButtons.find({
                where: {
                    id: id
                },
                transaction: transaction
            }) 
            .then(button => {
                if (!button) {
                    throw new Error('Button not found');
                }

                let keys = _.keys(req.body);
                _.forEach(keys, key => {
                    let data = req.body[key];
                    if (key === 'json' && typeof data === 'object') {
                        data = JSON.stringify(data);
                    }

                    button.set(key, data);
                });

                return button.save({
                    transaction: transaction
                });
            })
            .then((button) => {
                transaction.commit();
                return res.send(button);
            })
            .catch((err) => {
                return res.send({
                    status: 500,
                    message: 'Error updating the button.',
                    err: err.message
                });
            });
        });
}

function create(req, res, next) {
    sequelize.transaction()
        .then(transaction => {
            models.RfirRemotes
                .findOne({
                    where: {
                        rfir_device_id: req.body.rfir_remote_id
                    },
                    transaction: transaction
                }).then((remote) => {
                    if (!remote) {
                        throw new Error('Remote not found.')
                    }

                    req.body.rfir_remote_id = remote.id
                    return remote
                }).then((remote) => {
                    return models.RfirButtons.create(req.body, {
                        transaction: transaction
                    })
                })
                .then(button => {
                    if (!button) {
                        throw new Error('Unable to create the Button');
                    }

                    transaction.commit();

                    return res.send(button);
                })
                .catch((err) => {
                    console.log(err);
                    transaction.rollback();
                    res.send({
                        status: 500,
                        message: 'Error creating the button',
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
