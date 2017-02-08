'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash');

function findAll(req, res, next) {
    return models.Slave.findAll({
        include: [{
            model: models.Channels,
            as: 'channels_list'
        }, {
            model: models.RfirDevices,
            as: 'devices'
        }]
    })
    .then(slaves => {
        res.send(slaves);
    });
}

function create(req, res, next) {
    return models.Slave.create(req.body)
        .then(slave => {
            res.send(slave);
        });
}

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);
    let data = req.body;

    sequelize.transaction()
        .then(transaction => {
            models.Slave.find({
                where: {
                    id: id
                },
                transaction: transaction
            }) 
            .then(slave => {
                if (!slave) {
                    throw new Error('Slave not found');
                }

                let keys = _.keys(req.body);
                _.forEach(keys, key => {
                    console.log(`setting ${key} => ${req.body[key]}`);
                    slave.set(key, req.body[key]);
                });

                return slave.save({
                    transaction: transaction
                });
            })
            .then((slave) => {
                transaction.commit();
                return res.send(slave);
            })
            .catch((err) => {
                return next({
                    err: err.message,
                    log: err
                });
            });
        });
}

module.exports = {
    create: create,
    findAll: findAll,
    update: update
};
