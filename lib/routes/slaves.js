'use strict';

const models        = require('../models').Models,
    sequelize       = require('../models').sequelize,
    Sequelize       = require('sequelize'),
    Promise         = require('bluebird'),
    _               = require('lodash'),
    channelsState   = require('../ChannelsState'),
    slaveState      = require('../SlaveState'),
    infraredState   = require('../InfraredState'),
    ws              = require('../WebSocketHandler');

let Op = Sequelize.Op;

async function execute(req, res, next) {
    let action = req.body.action

    let data = await models.Slave.findOne({
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

    console.log(req.body)

    let payload = {}

    switch(action) {
        case 'on':
            console.log(`ON command on slave ${data.id}, channel: ${req.body.channel}`)
            payload = {
                'type': 'slave',
                'id': data.id,
                'command': 'light_control',
                'channel': req.body.channel,
                'value': 100
            }
        break;
        case 'off':
            console.log(`OFF command on slave ${data.id}, channel: ${req.body.channel}`)
            payload = {
                'type': 'slave',
                'id': data.id,
                'command': 'light_control',
                'channel': req.body.channel,
                'value': 0
            }
        break;
        case 'brightness':
            console.log(`BRIGHTNESS command on slave ${data.id}, channel: ${req.body.channel}`)
            payload = {
                'type': 'slave',
                'id': data.id,
                'command': 'light_control',
                'channel': req.body.channel,
                'value': req.body.value
            }
        break;
        case 'transmit':
            console.log(`TEMPERATURE command on slave ${data.id}, button: ${req.body.commandId}`)
            payload = {
                'type': 'slave',
                'id': data.id,
                'command': 'transmit',
                'rfir_command_id': req.body.commandId
            }
        break;
    }

    ws.send(JSON.stringify(payload));

    res.send({
        status: 'ok'
    })
}

async function find(req, res, next) {
    const data = await models.Slave.findOne({
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

    const commandIds = _getCommandsFromDevices(data.devices)

    const buttons = await models.RfirButtons.findAll({
        rfir_command_id: {
            [Op.in]: commandIds
        }
    })

    let slave = data.toJSON()

    slave.devices = slave.devices.map(device => {
        let commands = device.rfir_commands.map(command => command.id)

        device.buttons = _.filter(buttons, button => {
            return commands.indexOf(button.rfirCommandId) > -1
        })

        delete device.rfir_commands

        return device
    })

    if (slave.type === 'infrared') {
        delete slave.channels;

        slave.battery = infraredState.getSlaveBattery(slave.id)
        slave.temperature = infraredState.getSlaveTemperature(slave.id)
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

function _getCommandsFromDevices(devices) {
    return _.flatten(devices.map(device => {
        return device.rfir_commands.map(command => command.id)
    }))
}

async function findAll(req, res, next) {
    const slaves = await models.Slave.findAll({
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

    const commandIds = _.chain(slaves)
        .map(slave => {
            return _getCommandsFromDevices(slave.devices)
        })
        .flatten()
        .value()

    const buttons = await models.RfirButtons.findAll({
        rfir_command_id: {
            [Op.in]: commandIds
        }
    })

    const payload = slaves.map(slave => {
        slave = slave.toJSON()

        slave.devices = slave.devices.map(device => {
            let commands = device.rfir_commands.map(command => command.id)

            device.buttons = _.filter(buttons, button => {
                return commands.indexOf(button.rfirCommandId) > -1
            })

            return device
        })

        if (slave.type === 'infrared') {
            delete slave.channels;

            slave.battery = infraredState.getSlaveBattery(slave.id)
            slave.temperature = infraredState.getSlaveTemperature(slave.id)
        }

        slave.status = slaveState.getSlaveState(slave.id)
        slave.number_of_channels = slave.channels;
        delete slave.channels;

        slave.channels_list = _.map(slave.channels_list, channel => {
            let value = channelsState.getChannelState(slave.id, channel.channel);
            channel.value = value;

            return channel;
        });

        return slave
    })

    res.send(payload)
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
    execute,
    destroy
};
