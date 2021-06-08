const sequelize = require('../models').sequelize
const _ = require('lodash')
const moment = require('moment')

const getSlaveQuery = ({ slaveId, ambientId }) => {
  if (ambientId != null) {
    return `
      IN (
        SELECT slave_id
          FROM ambients_rfir_slaves_rel
         WHERE ambient_id = :ambientId
      )
    `
  }
  if (slaveId != null) {
    return `
      IN (
        :slaveId
      )
    `
  }
  return `
    NOT IN (
      SELECT id
        FROM slaves
       WHERE aggregate = FALSE
    )
  `
}

async function findSlave (req, res, next) {
  const slaveId = parseInt(req.params.slaveId)
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const datapoints = await queryDataByType({ type, start, end, slaveId })

  const values = getDatapoints(datapoints)

  const response = {
    slaveId,
    type,
    values
  }

  return res.send(response)
}

async function findAmbient (req, res, next) {
  const ambientId = parseInt(req.params.ambientId)
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const datapoints = await queryDataByType({ type, start, end, ambientId })

  const values = getDatapoints(datapoints)

  const response = {
    ambientId,
    type,
    values
  }

  return res.send(response)
}

async function queryYearlyData ({ start, end, slaveId, ambientId }) {
  const slaveQuery = getSlaveQuery({ slaveId, ambientId })

  const data = await sequelize.query(`
      WITH per_slave AS (
               SELECT time_bucket('1 hour', timestamp) AS time,
               (SUM(value) / COUNT(value)) AS value,
               slave_id
                 FROM consumption_realtime
                WHERE slave_id ${slaveQuery}
                  AND timestamp >= :start
                  AND timestamp < :end
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
      slaveId,
      ambientId
    },
    mapToModel: false
  })

  return _.first(data)
}

async function queryMonthlyData ({ start, end, slaveId, ambientId }) {
  const slaveQuery = getSlaveQuery({ slaveId, ambientId })

  const data = await sequelize.query(`
      WITH per_slave AS (
               SELECT time_bucket('1 hour', timestamp) AS time,
               (SUM(value) / COUNT(value)) AS value,
               slave_id
                 FROM consumption_realtime
                WHERE slave_id ${slaveQuery}
                  AND timestamp >= :start
                  AND timestamp < :end
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
      slaveId,
      ambientId
    },
    mapToModel: false
  })

  return _.first(data)
}

async function queryAllData ({ bucket, start, end, slaveId, ambientId }) {
  const slaveQuery = getSlaveQuery({ slaveId, ambientId })

  const data = await sequelize.query(`
           WITH per_slave AS (
         SELECT time_bucket(:bucket, timestamp) AS time,
         (SUM(value) / COUNT(value)) AS value,
         slave_id
           FROM consumption_realtime
          WHERE slave_id ${slaveQuery}
            AND timestamp >= :start
            AND timestamp < :end
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
      slaveId,
      ambientId
    },
    mapToModel: false
  })

  return _.first(data)
}

async function queryDataByType ({ type, ...props }) {
  switch (type) {
    case 'minute':
      return queryAllData({ bucket: '5 minutes', ...props })
    case 'hour':
      return queryAllData({ bucket: '1 hour', ...props })
    case 'day':
      return queryMonthlyData(props)
    case 'month':
      return queryYearlyData(props)
  }
}

async function findAll (req, res, next) {
  const type = req.params.type // minute, hour, day, ...
  const start = req.params.start
  const end = req.params.end

  const datapoints = await queryDataByType({ type, start, end })

  const values = getDatapoints(datapoints)

  const response = {
    slaveId: null,
    type,
    values
  }

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
  findAmbient,
  findSlave,
  findAll
}
