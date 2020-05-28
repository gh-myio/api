const models = require('../models').Models

/*
 * TODO: Paginate this.
 */
async function findAll (req, res, next) {
  try {
    const alertsHistory = await models.AlertHistory.findAll()

    return res.send(alertsHistory)
  } catch (e) {
    next({
      status: 500,
      message: 'Error querying ambient permissions'
    })
  }
}

module.exports = {
  findAll
}
