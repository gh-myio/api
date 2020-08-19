const models = require('../models').Models
const _ = require('lodash')

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

  require('../WebSocketHandler').send(JSON.stringify({
    type: 'admin',
    command: 'consumption_alerts_updated'
  }))

  return res.send({
    status: 200,
    message: 'Alert destroyed.'
  })
}

async function update (req, res, next) {
  const id = parseInt(req.params.id, 10)

  try {
    const alarm = await models.ConsumptionAlerts.findOne({
      where: {
        id: id
      }
    })

    alarm.set('extra', JSON.stringify(req.body.extra))
    alarm.set('slave_id', req.body.slave_id)
    alarm.set('type', req.body.type)
    alarm.set('name', req.body.name)

    await alarm.save()

    require('../WebSocketHandler').send(JSON.stringify({
      type: 'admin',
      command: 'consumption_alerts_updated'
    }))

    return res.send(alarm)
  } catch (e) {
    console.log(e)
    return res.send({
      status: 500,
      message: 'Error updating the alert',
      err: e.message
    })
  }
}

async function create (req, res, next) {
  const slaveId = req.body.slave_id
  const type = req.body.type
  const extra = req.body.extra
  const name = req.body.name

  try {
    const newAlert = await models.ConsumptionAlerts.create({
      type,
      slave_id: slaveId,
      name,
      extra: JSON.stringify(extra)
    })

    require('../WebSocketHandler').send(JSON.stringify({
      type: 'admin',
      command: 'consumption_alerts_updated'
    }))

    return res.send(newAlert)
  } catch (e) {
    console.log(e)
    return res.send({
      status: 500,
      message: 'Error creating the alert',
      err: e.message
    })
  }
}

module.exports = {
  findAll,
  findBySlaveId,
  update,
  destroy,
  create
}
