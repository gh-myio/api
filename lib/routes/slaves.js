'use strict';

const models        = require('../models').Models,
    sequelize       = require('../models').sequelize,
    Promise         = require('bluebird'),
    _               = require('lodash'),
    channelsState   = require('../ChannelsState'),
    infraredState   = require('../InfraredState'),
    ws              = require('../WebSocketHandler');

function findAll(req, res, next) {
    return models.Slave.findAll({
            include: [{
                model: models.Channels,
                as: 'channels_list'
            }, {
                model: models.RfirDevices,
                as: 'devices',
                include: [{
                    model: models.RfirCommands
                }]
            }]
        })
        .then(slaves => {

            slaves = _.map(slaves, (slave) => {
                slave = slave.toJSON();
                if (slave.type === 'infrared') {
                    delete slave.channels;

                    slave.battery = infraredState.getSlaveBattery(slave.id)
                    slave.temperature = infraredState.getSlaveTemperature(slave.id)
                }

                if (slave.type === 'light_switch') {
                    delete slave.operation_mode;
                }

                slave.number_of_channels = slave.channels;
                delete slave.channels;

                slave.channels_list = _.map(slave.channels_list, channel => {
                    let value = channelsState.getChannelState(slave.id, channel.channel);
                    channel.value = value;

                    return channel;
                });

                return slave;
            });

            res.send(slaves);
        });
}

function create(req, res, next) {
    let _slave = req.body.slave;
    let ambients = req.body.ambients;

    let responseSlave;

    sequelize.transaction()
        .then((transaction) => {
            models.Slave.create(_slave, {
                transaction: transaction
            })
            .then(slave => {
                responseSlave = slave;
                return slave.setAmbients(ambients, {
                    transaction: transaction
                });
            })
            .then((slave) => {
                transaction.commit()
                    .then(() => {
                        ws.send(JSON.stringify({
                            type: 'admin',
                            command: 'start_slave',
                            id: responseSlave.id
                        }));
                        return res.send(responseSlave);
                    })
            })
            .catch((err) => {
                transaction.rollback();
                return next({
                    message: 'Error creating slave',
                    err: err
                });
            });
        });
}

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);
    let slave = req.body.slave;
    let ambients = req.body.ambients;

    let regularConsumption = req.body.regular_consumption

    sequelize.transaction()
        .then(transaction => {
            models.Slave.find({
                where: {
                    id: id
                },
                transaction: transaction
            })
            .then(instance => {
                if (!instance) {
                    throw new Error('Slave not found');
                }

                let slave = instance.toJSON()
                let keys = _.keys(slave)

                _.forEach(keys, key => {
                    console.log(`setting ${key} => ${req.body.slave[key]}`);
                    instance.set(key, req.body.slave[key]);
                });

                slave.regular_consumption = regularConsumption

                return instance.save({
                    transaction: transaction
                });
            })
            .then((slave) => {
                return slave.setAmbients(ambients, {
                    transaction: transaction
                })
                .then(() => slave)
            })
            .then((slave) => {
                return transaction.commit()
                  .then(() => {
                    return res.send(slave);
                  })
            })
            .catch((err) => {
                return next({
                    err: err.message,
                    log: err
                });
            });
        });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.Slave.find({
        where: {
            id: id
        }
    })
    .then(slave => {
        if (!slave) {
            return next({
                status: 404,
                message: 'Slave not found'
            });
        }

        slave.destroy()
            .then(() => {
                ws.send(JSON.stringify({
                    type: 'admin',
                    command: 'remove_slave',
                    id: slave.id
                }));
                return res.send({
                    status: 200,
                    message: 'Slave destroyed.'
                });
            });
    });
}

module.exports = {
    create: create,
    findAll: findAll,
    update: update,
    destroy: destroy
};
