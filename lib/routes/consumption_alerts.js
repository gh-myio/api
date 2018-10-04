'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      _             = require('lodash'),
      ws            = require('../WebSocketHandler');

function findAll(req, res, next) {
    let type = req.params.type;
    let where = {};
    if (type) {
        where['type'] = type;
    }
    models.ConsumptionAlerts.findAll({where: where})
        .then(alerts => {
            if (!alerts) {
                return res.send([]);
            }
            
            let json = _.map(alerts, _alert => {
                let a = _alert.toJSON();
                if (typeof a.extra === 'string') {
                    a.extra = JSON.parse(a.extra);
                }

                return a;
            });

            return res.send(json);
        });
}

function findBySlaveId(req, res, next) {
    let slave_id = req.params.slaveId;
    let type = req.params.type;

    models.ConsumptionAlerts.find({
        where: {
            slave_id: slave_id,
            type: type
        }
    })
    .then(_alert => {
        if (!_alert) {
            return res.send({
                status: 404,
                message: 'Alert not found'
            });
        }

        let a = _alert.toJSON();
        if (typeof a.extra === 'string') {
            a.extra = JSON.parse(a.extra);
        }

        return res.send(a);
    });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.ConsumptionAlerts.find({
        where: {
            id: id
        }
    })
    .then(_alert => {
        if (!_alert) {
            return res.send({
                status: 404,
                message: 'Alert not found'
            });
        }

        _alert.destroy()
            .then(() => {
                ws.send(JSON.stringify({
                    type: 'admin',
                    command: 'consumption_alerts_updated'
                }));
                return res.send({
                    status: 200,
                    message: 'Alert destroyed.'
                });
            });
    });
}

function update(req, res, next) {
    let slaveId = req.params.slaveId;
    let type = req.params.type;
    let extra = req.body;

    sequelize.transaction()
        .then(transaction => {
            models.ConsumptionAlerts.destroy({
                where: {type: type, slave_id: slaveId},
                transaction: transaction
            })
            .then(() => {
                let _alert = {slave_id: slaveId, type: type};
                if (typeof extra === 'object') {
                    console.log('obj');
                    _alert['extra'] = JSON.stringify(extra);
                }

                models.ConsumptionAlerts.create(
                    _alert,
                    {transaction: transaction}
                )
                .then(_alert => {
                    if (!_alert) {
                        console.log('error saving');
                    }

                    transaction.commit().then(() => {
                        ws.send(JSON.stringify({
                            type: 'admin',
                            command: 'consumption_alerts_updated'
                        }));
                        return res.end();
                    });
                })
            })
            .catch((err) => {
                console.log(err);
                transaction.rollback();
                res.send({
                    status: 500,
                    message: 'Error creating the alerts',
                    err: err.message
                });
            });
        });
}

module.exports = {
    findAll: findAll,
    findBySlaveId: findBySlaveId,
    update: update,
    destroy: destroy
};
