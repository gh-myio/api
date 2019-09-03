const sequelize = require('../models').sequelize
const _ = require('lodash')
const moment = require('moment')

function getBucket (type) {
  let bucket
  switch (type) {
    case 'minute':
      bucket = '5 minutes'
      break
    case 'hour':
      bucket = '1 hour'
      break
    case 'day':
      bucket = '1 day'
      break
    case 'month':
      bucket = '1 month'
      break
  }

  return bucket
}

async function findSlave (req, res, next) {
  const slaveId = parseInt(req.params.slaveId)
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const bucket = getBucket(type)

  const datapoints = await querySlaveData(slaveId, bucket, start, end)

  const values = getDatapoints(datapoints)

  const response = {
    slaveId: slaveId,
    ambientId: null,
    type: type
  }

  response.values = values

  return res.send(response)
}

async function findAmbient (req, res, next) {
  const ambientId = parseInt(req.params.ambientId)
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const bucket = getBucket(type)
  const datapoints = await queryAmbientData(ambientId, bucket, start, end)

  const values = getDatapoints(datapoints)

  const response = {
    slaveId: null,
    ambientId: ambientId,
    type: type
  }

  response.values = values

  return res.send(response)
}

async function queryAmbientData (ambientId, bucket, start, end) {
  const data = await sequelize.query(`
        SELECT time_bucket(:bucket, timestamp) AS time,
        (SUM(value) / COUNT(value)) AS value
          FROM consumption_realtime
         WHERE timestamp >= :start
           AND timestamp < :end
           AND ambient_id IN (ARRAY[:ambientId])
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
  })

  return _.first(data)
}

async function querySlaveData (slave, bucket, start, end) {
  const data = await sequelize.query(`
        SELECT time_bucket(:bucket, timestamp) AS time,
        (SUM(value) / COUNT(value)) AS value
          FROM consumption_realtime
         WHERE timestamp >= :start
           AND timestamp < :end
           AND slave_id = :slave
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
  })

  return _.first(data)
}

async function queryAllData (bucket, start, end) {
  const data = await sequelize.query(`
           WITH per_slave AS (
         SELECT time_bucket(:bucket, timestamp) AS time,
         (SUM(value) / COUNT(value)) AS value,
         slave_id
           FROM consumption_realtime
          WHERE timestamp >= :start
            AND timestamp < :end
            AND slave_id NOT IN (
         SELECT id
           FROM slaves
          WHERE aggregate = FALSE)
       GROUP BY time, slave_id
       ORDER BY time DESC)
       -- The median of the hours is the sum of the hourly
       -- median of the slaves
         SELECT time AS time,
     SUM(value) AS value
           FROM per_slave
       GROUP BY time
       ORDER BY time DESC;
    `, {
    replacements: {
      bucket,
      start,
      end
    },
    mapToModel: false
  })

  return _.first(data)
}

async function findAll (req, res, next) {
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const bucket = getBucket(type)

  const datapoints = await queryAllData(bucket, start, end)

  const values = getDatapoints(datapoints)

  const response = {
    slaveId: null,
    ambientId: null,
    type: type
  }

  response.values = values

  return res.send(response)
}

function getDatapoints (raw) {
  if (!raw) {
    return []
  }

  return _.map(raw, datapoint => {
    return {
      timestamp: moment(datapoint.time).format(),
      value: datapoint.value
    }
  })
}

module.exports = {
  findSlave: findSlave,
  findAmbient: findAmbient,
  findAll: findAll
}
