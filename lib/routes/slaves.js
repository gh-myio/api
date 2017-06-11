'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash'),
      channelsState = require('../ChannelsState'),
      infraredState = require('../InfraredState');

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
