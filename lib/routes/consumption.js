'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash'),
      moment        = require('moment');

function findSlave(req, res, next) {
    let slaveId = parseInt(req.params.slaveId);
    let type = req.params.type; // minute, hour, day, ...
    let start = req.params.start;
    let end = req.params.end;

    models.Consumption.findAll({
        where: {
            slaveId: slaveId,
            type: type,
            timestamp: {
                $gte: start,
                $lt: end
            }
        }
    })
    .then(datapoints => {
        let response = {
            slaveId: slaveId,
            ambientId: null,
            type: type
        };
        
        let values = getDatapoints(datapoints);
        response.values = values;

        return res.send(response);
    });
}

function findAmbient(req, res, next) {
    let ambientId = parseInt(req.params.ambientId);
    let type = req.params.type; // minute, hour, day, ...
    let start = req.params.start;
    let end = req.params.end;

    models.Consumption.findAll({
        where: {
            slaveId: {
                $eq: null
            },
            ambientId: ambientId,
            type: type,
            timestamp: {
                $gte: start,
                $lt: end
            }
        }
    })
    .then(datapoints => {
        let response = {
            slaveId: null,
            ambientId: ambientId,
            type: type
        };
        
        let values = getDatapoints(datapoints);
        response.values = values;

        return res.send(response);
    });
}

function findAll(req, res, next) {
    let type = req.params.type; // minute, hour, day, ...
    let start = req.params.start;
    let end = req.params.end;

    models.Consumption.findAll({
        where: {
            slaveId: {
                $eq: null
            },
            ambientId: {
                $eq: null
            },
            type: type,
            timestamp: {
                $gte: start,
                $lt: end
            }
        }
    })
    .then(datapoints => {
        let response = {
            slaveId: null,
            ambientId: null,
            type: type
        };
        
        let values = getDatapoints(datapoints);
        response.values = values;

        return res.send(response);
    });
}

function getDatapoints(raw) {
    if (!raw) {
        return [];
    }

    return _.map(raw, datapoint => {
        let d = datapoint.toJSON();
        let ret = {
            timestamp: moment(d.timestamp).format(),
            value: d.value
        }

        return ret;
    });
}

module.exports = {
    findSlave: findSlave,
    findAmbient: findAmbient,
    findAll: findAll
};
