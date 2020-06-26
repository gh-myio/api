const sequelize = require('../models').sequelize
const { first } = require('lodash')

async function queryAllData (start, end, slave) {
  const data = await sequelize.query(`
      SELECT timestamp, value
        FROM temperature_history
       WHERE slave_id = :slave
         AND timestamp >= :start
         AND timestamp < :end
    GROUP BY timestamp, value
    ORDER BY timestamp DESC;
    `, {
    replacements: {
      start,
      end,
      slave
    },
    mapToModel: false
  })

  return first(data)
}

async function query (req, res, next) {
  const slaveId = parseInt(req.params.slaveId, 10)
  const start = req.params.start
  const end = req.params.end

  try {
    const data = await queryAllData(start, end, slaveId)

    res.send(data)
  } catch (e) {
    console.log(e)

    return next({
      status: 500,
      message: 'Error querying temperature'
    })
  }
}

module.exports = {
  query
}
