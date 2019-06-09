'use strict';

const models      = require('../models').Models,
    sequelize     = require('../models').sequelize,
    Promise       = require('bluebird'),
    _             = require('lodash'),
    ws            = require('../WebSocketHandler');

async function findAll(req, res, next) {
    let type = req.params.type;
    let where = {};

    if (type) {
        where['type'] = type;
    }

    let alerts = await models.ConsumptionAlerts.findAll({where: where})

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
}

async function findBySlaveId(req, res, next) {
    let slave_id = req.params.slaveId;
    let type = req.params.type;

    let _alert = await models.ConsumptionAlerts.findOne({
        where: {
            slave_id: slave_id,
            type: type
        }
    })

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
}

async function destroy(req, res, next) {
    let id = req.params.id;

    let _alert = await models.ConsumptionAlerts.findOne({
        where: {
            id: id
        }
    })

    if (!_alert) {
        return res.send({
            status: 404,
            message: 'Alert not found'
        });
    }

    await _alert.destroy()

    ws.send(JSON.stringify({
        type: 'admin',
        command: 'consumption_alerts_updated'
    }));

    return res.send({
        status: 200,
        message: 'Alert destroyed.'
    });
}

async function update(req, res, next) {
    let slaveId = req.params.slaveId;
    let type = req.params.type;
    let extra = req.body;

    return sequelize.transaction(async (t) => {
        try {
            await models.ConsumptionAlerts.destroy({
                where: {type: type, slave_id: slaveId},
                transaction: transaction
            })

            let _alert = {slave_id: slaveId, type: type};

            if (typeof extra === 'object') {
                _alert['extra'] = JSON.stringify(extra);
            }

            let newAlert = models.ConsumptionAlerts.create(
                _alert,
                {transaction: transaction}
            )

            if (!newAlert) {
                console.log('error saving');
            }

            await transaction.commit()

            ws.send(JSON.stringify({
                type: 'admin',
                command: 'consumption_alerts_updated'
            }));

            return res.send({
                status: 200,
                message: 'ok'
            });

        } catch(err) {
            console.log(err);
            transaction.rollback();
            return res.send({
                status: 500,
                message: 'Error creating the alerts',
                err: err.message
            });
        }
    })
}

module.exports = {
    findAll: findAll,
    findBySlaveId: findBySlaveId,
    update: update,
    destroy: destroy
};
