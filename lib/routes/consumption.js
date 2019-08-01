'use strict';

const models        = require('../models').Models,
    sequelize     = require('../models').sequelize,
    Sequelize     = require('sequelize'),
    Promise       = require('bluebird'),
    _             = require('lodash'),
    moment        = require('moment');

let Op = Sequelize.Op;

function getBucket(type) {
    let bucket
    switch(type) {
        case 'minute':
            bucket = '5 minutes'
            break;
        case 'hour':
            bucket = '1 hour'
            break;
        case 'day':
            bucket = '1 day'
            break;
        case 'month':
            bucket = '1 month'
            break;
    }

    return bucket
}

async function findSlave(req, res, next) {
    let slaveId = parseInt(req.params.slaveId);
    let type = req.params.type; // minute, hour, day, ...
    let start = req.params.start;
    let end = req.params.end;

    let bucket = getBucket(type)

    let datapoints = await querySlaveData(slaveId, bucket, start, end)

    let dateStart = new Date(start)
    let dateEnd = moment(end).add(1, 'hour').utc().toDate()
    let today = new Date()
    let values = getDataPoints(datapoints)

    if (type === 'hour' &&
        dateStart.getDate() === today.getDate()) {

        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)

        let lastHourData = await querySlaveData(slaveId, '1 hour', today, dateEnd)

        let lastHourValue = _.first(lastHourData)

        values.push({
            timestamp: moment(today).format(),
            value: _.get(lastHourValue, 'value') || 0
        })
    }

    let response = {
        slaveId: slaveId,
        ambientId: null,
        type: type
    };

    response.values = values;

    return res.send(response);
}

async function findAmbient(req, res, next) {
    let ambientId = parseInt(req.params.ambientId);
    let type = req.params.type; // minute, hour, day, ...
    let start = req.params.start;
    let end = req.params.end;

    let bucket = getBucket(type)
    let datapoints = await queryAmbientData(ambientId, bucket, start, end)

    let dateStart = new Date(start)
    let dateEnd = moment(end).add(1, 'hour').utc().toDate()
    let today = new Date()
    let values = getDatapoints(datapoints);

    if (type === 'hour' &&
        dateStart.getDate() === today.getDate()) {

        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)

        let lastHourData = await queryAmbientData(ambientId, '1 hour', today, dateEnd)

        let lastHourValue = _.first(lastHourData)

        values.push({
            timestamp: moment(today).format(),
            value: _.get(lastHourValue, 'value') || 0
        })
    }

    let response = {
        slaveId: null,
        ambientId: ambientId,
        type: type
    };

    response.values = values;

    return res.send(response);
}

async function queryAmbientData(ambientId, bucket, start, end) {
    let data = await sequelize.query(`
        SELECT time_bucket(:bucket, timestamp) AS time,
            (SUM(value) / COUNT(value)) AS value
              FROM consumption_realtime
              WHERE timestamp >= :start AND
                    timestamp < :end AND
                    ambient_id IN (ARRAY[:ambientId])
              GROUP BY time
              ORDER BY time DESC;
    `, {
        replacements: {
            ambientId,
            bucket,
            start,
            end
        },
        mapToModel: false
    });

    return _.first(data)
}

async function querySlaveData(slave, bucket, start, end) {
    let data = await sequelize.query(`
        SELECT time_bucket(:bucket, timestamp) AS time,
            (SUM(value) / COUNT(value)) AS value
              FROM consumption_realtime
              WHERE timestamp >= :start AND
                    timestamp < :end AND
                    slave_id = :slave
              GROUP BY time
              ORDER BY time DESC;
    `, {
        replacements: {
            slave,
            bucket,
            start,
            end
        },
        mapToModel: false
    });

    return _.first(data)
}

async function queryAllData(bucket, start, end) {
    let data = await sequelize.query(`
        SELECT time_bucket(:bucket, timestamp) AS time,
            (SUM(value) / COUNT(value)) AS value
              FROM consumption_realtime
              WHERE timestamp >= :start AND
                    timestamp < :end
              GROUP BY time
              ORDER BY time DESC;
    `, {
        replacements: {
            bucket,
            start,
            end
        },
        mapToModel: false
    });

    return _.first(data)
}

async function findAll(req, res, next) {
    let type = req.params.type; // minute, hour, day, ...
    let start = req.params.start;
    let end = req.params.end;

    let bucket = getBucket(type)

    let datapoints = await queryAllData(bucket, start, end)

    let dateStart = new Date(start)
    let dateEnd = moment(end).add(1, 'hour').utc().toDate()
    let today = new Date()
    let values = getDatapoints(datapoints);

    if (type === 'hour' &&
        dateStart.getDate() === today.getDate()) {

        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)

        let lastHourData = await queryAllData('1 hour', today, dateEnd)

        let lastHourValue = _.first(lastHourData)

        values.push({
            timestamp: moment(today).format(),
            value: _.get(lastHourValue, 'value') || 0
        })
    }

    let response = {
        slaveId: null,
        ambientId: null,
        type: type
    };

    response.values = values;

    return res.send(response);
}

function getDatapoints(raw) {
    if (!raw) {
        return [];
    }

    return _.map(raw, datapoint => {
        return {
            timestamp: moment(datapoint.time).format(),
            value: datapoint.value
        }
    });
}

module.exports = {
    findSlave: findSlave,
    findAmbient: findAmbient,
    findAll: findAll
};
