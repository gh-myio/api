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

  const datapoints = await queryDataByType(type, start, end, slaveId)

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

async function queryYearlyData (start, end, slave) {
  const slaveQuery = slave ? `
    IN (
      :slave
    )
  ` : `
    NOT IN (
      SELECT id
        FROM slaves
       WHERE aggregate = FALSE
    )
  `

  const data = await sequelize.query(`
      WITH per_slave AS (
               SELECT time_bucket('1 hour', timestamp) AS time,
               (SUM(value) / COUNT(value)) AS value,
               slave_id
                 FROM consumption_realtime
                WHERE timestamp >= :start
                  AND timestamp < :end
                  AND slave_id ${slaveQuery}
             GROUP BY time, slave_id
             ORDER BY time DESC),

          hourly AS (
               SELECT time_bucket('1 day', time) AS time,
               SUM(value) AS value
               FROM per_slave
               GROUP BY time)

      SELECT time, SUM(value) AS value FROM hourly
               GROUP BY time
               ORDER BY time DESC
    `, {
    replacements: {
      start,
      end,
      slave
    },
    mapToModel: false
  })

  return _.first(data)
}

async function queryMonthlyData (start, end, slave) {
  const slaveQuery = slave ? `
    IN (
      :slave
    )
  ` : `
    NOT IN (
      SELECT id
        FROM slaves
       WHERE aggregate = FALSE
    )
  `
  const data = await sequelize.query(`
      WITH per_slave AS (
               SELECT time_bucket('1 hour', timestamp) AS time,
               (SUM(value) / COUNT(value)) AS value,
               slave_id
                 FROM consumption_realtime
                WHERE timestamp >= :start
                  AND timestamp < :end
                  AND slave_id ${slaveQuery}
             GROUP BY time, slave_id
             ORDER BY time DESC),

            hourly AS (
               SELECT time_bucket('1 day', time) AS time,
               SUM(value) AS value
               FROM per_slave
               GROUP BY time)

      SELECT time, SUM(value) AS value FROM hourly
               GROUP BY time
               ORDER BY time DESC
    `, {
    replacements: {
      start,
      end,
      slave
    },
    mapToModel: false
  })

  return _.first(data)
}

async function queryAllData (bucket, start, end, slave) {
  const slaveQuery = slave ? `
    IN (
      :slave
    )
  ` : `
    NOT IN (
      SELECT id
        FROM slaves
       WHERE aggregate = FALSE
    )
  `

  const data = await sequelize.query(`
           WITH per_slave AS (
         SELECT time_bucket(:bucket, timestamp) AS time,
         (SUM(value) / COUNT(value)) AS value,
         slave_id
           FROM consumption_realtime
          WHERE timestamp >= :start
            AND timestamp < :end
            AND slave_id ${slaveQuery}
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
      end,
      slave
    },
    mapToModel: false
  })

  return _.first(data)
}

async function queryDataByType (type, start, end, slave) {
  let bucket
  switch (type) {
    case 'minute':
      bucket = '5 minutes'
      return queryAllData(bucket, start, end, slave)
    case 'hour':
      bucket = '1 hour'
      return queryAllData(bucket, start, end, slave)
    case 'day':
      return queryMonthlyData(start, end, slave)
    case 'month':
      return queryYearlyData(start, end, slave)
  }
}

async function findAll (req, res, next) {
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const datapoints = await queryDataByType(type, start, end)

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
      timestamp: moment(datapoint.time).toISOString(),
      value: datapoint.value
    }
  })
}

module.exports = {
  findSlave: findSlave,
  findAmbient: findAmbient,
  findAll: findAll
}