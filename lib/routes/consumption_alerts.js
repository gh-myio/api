const models = require('../models').Models
const sequelize = require('../models').sequelize
const _ = require('lodash')
const ws = require('../WebSocketHandler')

async function findAll (req, res, next) {
  const type = req.params.type
  const where = {}

  if (type) {
    where.type = type
  }

  const alerts = await models.ConsumptionAlerts.findAll({ where: where })

  if (!alerts) {
    return res.send([])
  }

  const json = _.map(alerts, _alert => {
    const a = _alert.toJSON()
    if (typeof a.extra === 'string') {
      a.extra = JSON.parse(a.extra)
    }

    return a
  })

  return res.send(json)
}

async function findBySlaveId (req, res, next) {
  const slaveId = req.params.slaveId
  const type = req.params.type

  const _alert = await models.ConsumptionAlerts.findOne({
    where: {
      slave_id: slaveId,
      type: type
    }
  })

  if (!_alert) {
    return res.send({
      status: 404,
      message: 'Alert not found'
    })
  }

  const a = _alert.toJSON()

  if (typeof a.extra === 'string') {
    a.extra = JSON.parse(a.extra)
  }

  return res.send(a)
}

async function destroy (req, res, next) {
  const id = req.params.id

  const _alert = await models.ConsumptionAlerts.findOne({
    where: {
      id: id
    }
  })

  if (!_alert) {
    return res.send({
      status: 404,
      message: 'Alert not found'
    })
  }

  await _alert.destroy()

  ws.send(JSON.stringify({
    type: 'admin',
    command: 'consumption_alerts_updated'
  }))

  return res.send({
    status: 200,
    message: 'Alert destroyed.'
  })
}

async function update (req, res, next) {
  const slaveId = req.params.slaveId
  const type = req.params.type
  const extra = req.body

  try {
    sequelize.transaction(async (transaction) => {
      await models.ConsumptionAlerts.destroy({
        where: { type: type, slave_id: slaveId },
        transaction: transaction
      })

      const _alert = { slave_id: slaveId, type: type }

      if (typeof extra === 'object') {
        _alert.extra = JSON.stringify(extra)
      }

      const newAlert = await models.ConsumptionAlerts.create(
        _alert,
        { transaction: transaction }
      )

      if (!newAlert) {
        console.log('error saving')
        throw new Error('Error saving')
      }

      ws.send(JSON.stringify({
        type: 'admin',
        command: 'consumption_alerts_updated'
      }))

      return res.send({
        status: 200,
        message: 'ok'
      })
    })
  } catch (err) {
    console.log(err)
    return res.send({
      status: 500,
      message: 'Error creating the alerts',
      err: err.message
    })
  }
}

module.exports = {
  findAll: findAll,
  findBySlaveId: findBySlaveId,
  update: update,
  destroy: destroy
}
