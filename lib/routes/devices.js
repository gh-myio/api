'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash');


function destroy(req, res, next) {
    let id = req.params.id;

    models.RfirDevices.find({
        where: {
            id: id
        }
    })
    .then(device => {
        if (!device) {
            return next({
                status: 404,
                message: 'Device not found'
            });
        }

        device.destroy()
            .then(() => {
                return res.send({
                    status: 200,
                    message: 'Device destroyed.'
                });
            });
    });
}

function create(req, res, next) {
    return models.RfirDevices.create(req.body)
        .then(device => {
            res.json(device);
        })
        .catch((err) => {
            return next({
                status: 500,
                message: 'Error creating the device'
            });
        });
}

function findDevices(req, res, next) {
    let id = parseInt(req.params.id, 10);

    sequelize.transaction()
        .then((transaction) => {
            models.RfirDevices.find({
                attributes: [
                    'id'
                ],
                where: {
                    id: id
                },
                include: [{
                    model: models.RfirRemotes,
                    attributes: [
                        'id',
                        'name'
                    ],
                    include: [{
                        model: models.RfirButtons,
                        attributes: [
                            'id',
                            'name',
                            'indexes',
                            'color',
                            'rfir_command_id'
                        ]
                    }]
                }],
                transaction: transaction
            })
            .then((rfirDevices) => {
                transaction.commit();
                if (!rfirDevices || !_.has(rfirDevices, 'rfir_remotes')) {
                    res.status(404);
                    return res.send({
                        status: 404,
                        message: 'Device not found'
                    });
                }

                return res.send(rfirDevices['rfir_remotes']);
            })
            .catch((err) => {
                res.status(500);

                return res.send({
                    status: 500,
                    message: 'There was an error finding the requested device',
                    err: err.message
                });
            });
        });
}

module.exports = {
    findDevices: findDevices,
    create: create,
    destroy: destroy
};
