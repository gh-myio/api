// const models = require('../models').Models
const sequelize = require('../models').sequelize
const _ = require('lodash')

/*
 * TODO: Paginate this.
 */
async function findAll (req, res, next) {
  try {
    const query = `
  SELECT DISTINCT ON ("alert_history".id) "alert_history".id,
                     "alert_history".alert_id AS alert_id,
                     "alert_history".slave_id AS slave_id,
                     "alert_history".channel_id AS channel_id,
                     "alert_history".date AS date,
                     "alert_history".duration AS duration,
                     "alert_history".status AS status,
                     "alert_history".viewed AS viewed,
                     "consumption_alerts"."type" AS type
                FROM alert_history
          INNER JOIN "slaves"
                  ON "slaves"."id" = slave_id
          INNER JOIN "consumption_alerts"
                  ON "consumption_alerts"."id" = "alert_history"."alert_id"
            ORDER BY "alert_history"."id" DESC
               LIMIT 100
    `

    const data = await sequelize.query(query, {
      mapToModel: false
    })

    return res.send(_.first(data))
  } catch (e) {
    console.log(e)
    next({
      status: 500,
      message: 'Error querying ambient permissions'
    })
  }
}

async function findByStatus (req, res, next) {
  const status = req.params.status === 'open' ? 'OPEN' : 'RESOLVED'

  try {
    const query = `
SELECT DISTINCT ON ("consumption_alerts".id) "alert_history".id,
                     "alert_history".alert_id AS alert_id,
                     "alert_history".slave_id AS slave_id,
                     "alert_history".channel_id AS channel_id,
                     "alert_history".date AS date,
                     "alert_history".duration AS duration,
                     "alert_history".status AS status,
                     "alert_history".viewed AS viewed,
                     "consumption_alerts"."type" AS type
                FROM alert_history
          LEFT OUTER JOIN "slaves"
                  ON "slaves"."id" = slave_id
          LEFT OUTER JOIN "consumption_alerts"
                  ON "consumption_alerts"."id" = "alert_history"."alert_id"
               WHERE "alert_history"."status" = :status
            ORDER BY "consumption_alerts".id, "alert_history"."id" DESC
    `

    const data = await sequelize.query(query, {
      mapToModel: false,
      replacements: { status }
    })

    return res.send(_.first(data))
  } catch (e) {
    console.log(e)
    next({
      status: 500,
      message: 'Error querying ambient permissions'
    })
  }
}

/* async function setViewed (req, res, next) {
  try {
    const alerts = _.map(req.body, 'id')
    const alertsHistory = await models.AlertHistory.findAll()

    return res.send(alertsHistory)
  } catch (e) {
    console.log(e)
    next({
      status: 500,
      message: 'Error querying ambient permissions'
    })
  }
} */

module.exports = {
  findAll,
  findByStatus
}
