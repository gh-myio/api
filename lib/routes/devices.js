'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash');

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
    findDevices: findDevices
};
