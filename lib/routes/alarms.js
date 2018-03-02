'use strict';

const models        = require('../models').Models,
    sequelize       = require('../models').sequelize,
    Promise         = require('bluebird'),
    _               = require('lodash');

function findAll(req, res, next) {
    let limit = (req.query.limit != null ? req.query.limit : 15);
    return models.Alarm.findAll({
        limit: limit, 
        include: [{
            model: models.Slave,
            attributes: ['name']
        }]
        })
        .then(alarms => {

            alarms = _.map(alarms, (alarm) => {
                alarm = alarm.toJSON();

                alarm.name = alarm.slave.name;
                delete alarm.slave;

                return alarm;
            });

            res.send(alarms);
        });
}


module.exports = {
    findAll: findAll
};
