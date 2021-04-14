const sequelize = require('../models').sequelize
const { first } = require('lodash')

async function queryAllData (start, end, slave, kind) {
  const operation = (() => {
    switch (kind) {
      case 'max':
        return 'MAX'
      case 'min':
        return 'MIN'
      default:
        return 'AVG'
    }
  })()
  const data = await sequelize.query(`
      SELECT time_bucket_gapfill('1 hour', timestamp) AS date,
             ${operation}(value) AS value
        FROM public.temperature_history
       WHERE slave_id = :slave
         AND timestamp >= :start
         AND timestamp < :end
    GROUP BY date
    ORDER BY date DESC;
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
  const kind = req.query.kind

  try {
    const data = await queryAllData(start, end, slaveId, kind)

    res.send(data)
  } catch (e) {
    console.log(e)

    return next({
      status: 500,
      message: 'Error querying temperature'
    })
  }
}

module.exports = { query }
