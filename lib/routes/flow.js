const sequelize = require('../models').sequelize
const _ = require('lodash')
const moment = require('moment')

async function queryAllData (start, end, slave, channel) {
  const data = await sequelize.query(`
    SELECT * FROM public.channel_pulse_log
     WHERE slave_id = :slave
       AND channel = :channel
       AND timestamp >= :start
       AND timestamp < :end
  ORDER BY timestamp DESC
    `, {
    replacements: {
      start,
      end,
      slave,
      channel
    },
    mapToModel: false
  })

  return _.first(data)
}

async function findByChannel (req, res, next) {
  const start = req.params.start
  const end = req.params.end
  const slaveId = req.params.slaveId
  const channel = req.params.channel

  console.log({
    start,
    end,
    slaveId,
    channel
  })

  const datapoints = await queryAllData(start, end, slaveId, channel)

  const values = getDatapoints(datapoints)

  const response = {
    slaveId,
    channel,
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
      reading: datapoint.reading,
      value: datapoint.value
    }
  })
}

module.exports = { findByChannel }
