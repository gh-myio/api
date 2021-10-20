const models = require('../models').Models
const sequelize = require('../models').sequelize
const _ = require('lodash')

function findAll (req, res, next) {
  models.RfirButtons.findAll()
    .then(buttons => {
      if (!buttons) {
        return res.send([])
      }

      const json = _.map(buttons, button => {
        const s = button.toJSON()
        if (typeof s.json === 'string') {
          s.json = JSON.parse(s.json)
        }

        return s
      })

      return res.send(json)
    })
}

function findById (req, res, next) {
  const id = req.params.id

  models.RfirButtons.findOne({
    where: {
      id: id
    }
  })
    .then(button => {
      if (!button) {
        return res.send({
          status: 404,
          message: 'Button not found'
        })
      }

      return res.send(button)
    })
}

function destroy (req, res, next) {
  const id = req.params.id

  models.RfirButtons.findOne({
    where: {
      id: id
    }
  })
    .then(button => {
      if (!button) {
        return res.send({
          status: 404,
          message: 'Button not found'
        })
      }

      button.destroy()
        .then(() => {
          require('../WebSocketHandler').send(JSON.stringify({
            type: 'admin',
            command: 'update_rfir_buttons'
          }))

          return res.send({
            status: 200,
            message: 'Button destroyed.'
          })
        })
    })
}

/* Body is an array of buttons in format:
 * { id: button_id, order: order } */
async function updateButtonOrder (req, res, next) {
  const buttons = req.body

  if (!buttons) {
    return res.send({
      status: 500,
      message: 'Error updating the button.'
    })
  }

  const ids = _.map(req.body, 'id')

  const dbButtons = await models.RfirButtons.findAll({
    where: {
      id: ids
    }
  })

  await Promise.all(dbButtons.map((button) => {
    const order = _.find(buttons, { id: button.id })
    if (!order) return Promise.resolve()

    button.order = order.order

    return button.save()
  }))

  return res.send({
    status: 200,
    message: 'OK'
  })
}

async function update (req, res, next) {
  const id = parseInt(req.params.id, 10)

  try {
    const transaction = await sequelize.transaction()
    const button = await models.RfirButtons.findOne({
      where: { id: id },
      transaction
    })

    if (!button) {
      throw new Error('Button not found')
    }

    const keys = _.keys(req.body)

    _.forEach(keys, key => {
      const data = req.body[key]

      button.set(key, data)
    })

    await button.save({ transaction })
    await transaction.commit()

    require('../WebSocketHandler').send(JSON.stringify({
      type: 'admin',
      command: 'update_rfir_buttons'
    }))

    return res.send(button)
  } catch (err) {
    return res.send({
      status: 500,
      message: 'Error updating the button.',
      err: err.message
    })
  }
}

async function create (req, res, next) {
  try {
    sequelize.transaction(async (transaction) => {
      const remote = await models.RfirRemotes.findOne({
        where: {
          rfir_device_id: req.body.rfir_remote_id
        },
        transaction: transaction
      })

      if (!remote) throw new Error('Remote not found.')

      const button = await models.RfirButtons.create(req.body, {
        transaction: transaction
      })

      if (!button) throw new Error('Unable to create the Button')

      await button.setRfir_remote(remote.id, {
        transaction: transaction
      })
      await button.setRfir_command(req.body.rfir_command_id, {
        transaction: transaction
      })

      require('../WebSocketHandler').send(JSON.stringify({
        type: 'admin',
        command: 'update_rfir_buttons'
      }))

      return res.send(button)
    })
  } catch (err) {
    res.send({
      status: 500,
      message: 'Error creating the button',
      err: err.message
    })
  }
}

module.exports = {
  updateButtonOrder,
  findAll,
  findById,
  create,
  update,
  destroy
}
