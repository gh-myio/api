'use strict';

const models        = require('../models').Models,
    sequelize       = require('../models').sequelize,
    Promise         = require('bluebird'),
    _               = require('lodash'),
    channelsState   = require('../ChannelsState'),
    slaveState      = require('../SlaveState'),
    infraredState   = require('../InfraredState'),
    ws              = require('../WebSocketHandler');

async function find(req, res, next) {
    let data = await models.Slave.find({
        where: {
            id: req.params.id
        },
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

    if (!data) {
        res.status(404)
        return res.send({
            message: 'Slave not found.'
        })
    }

    let slave = data.toJSON()

    if (slave.type === 'infrared') {
        delete slave.channels;

        slave.battery = infraredState.getSlaveBattery(slave.id)
        slave.temperature = infraredState.getSlaveTemperature(slave.id)
    }

    if (slave.type === 'light_switch') {
        delete slave.operation_mode;
    }

    slave.status = slaveState.getSlaveState(slave.id)
    slave.number_of_channels = slave.channels;
    delete slave.channels;

    slave.channels_list = _.map(slave.channels_list, channel => {
        let value = channelsState.getChannelState(slave.id, channel.channel);
        channel.value = value;

        return channel;
    });

    res.json(slave)
}

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

                slave.status = slaveState.getSlaveState(slave.id)
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

async function create(req, res, next) {
    let _slave = req.body.slave;
    let ambients = req.body.ambients;

    let transaction = await sequelize.transaction()

    try {
        let slave = await models.Slave.create(_slave, { transaction })

        await slave.setAmbients(ambients, { transaction })
        await transaction.commit()

        ws.send(JSON.stringify({
            type: 'admin',
            command: 'start_slave',
            id: slave.id
        }));

        res.send(slave);

    } catch(e) {
        console.log('Error', e)
        transaction.rollback();

        return next({
            message: 'Error creating slave',
            err: e
        });
    }
}

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);
    let slave = req.body.slave;
    let ambients = req.body.ambients;

    sequelize.transaction()
        .then(transaction => {
            models.Slave.findOne({
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
                    instance.set(key, req.body.slave[key]);
                });

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
            }).catch((err) => {
                transaction.rollback()
                return next({
                    err: err.message,
                    log: err
                });
            });
        });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.Slave.findOne({
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
    create,
    find,
    findAll,
    update,
    destroy
};
