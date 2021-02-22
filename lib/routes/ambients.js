const models = require('../models').Models
const sequelize = require('../models').sequelize
const Sequelize = require('sequelize')
const Promise = require('bluebird')
const _ = require('lodash')
const utils = require('../utils')

const Op = Sequelize.Op

async function findAll (req, res, next) {
  const token = req.headers['x-access-token']
  const allowedAmbientList = await utils.getUserAllowedAmbients(token)

  const query = {
    where: {
      id: {
        [Op.in]: allowedAmbientList
      }
    },
    include: [{
      model: models.Slave,
      attributes: [
        'id',
        'type',
        'addr_low',
        'addr_high',
        'channels',
        'name'
      ]
    }]
  }

  const ambients = await models.Ambients.findAll(query)

  if (!ambients) {
    return res.send([])
  }

  return res.send(ambients)
}

function findById (req, res, next) {
  const id = req.params.id

  models.Ambients.findOne({
    where: {
      id: id
    }
  })
    .then(ambients => {
      if (!ambients) {
        return next({
          status: 404,
          message: 'Ambient not found'
        })
      }

      return res.send(ambients)
    })
    .catch((err) => {
      return next({
        err: err,
        log: err
      })
    })
}

async function destroy (req, res, next) {
  /* if (utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    } */

  const id = req.params.id

  const ambient = await models.Ambients.findOne({
    where: {
      id: id
    }
  })

  if (!ambient) {
    return next({
      status: 404
    })
  }

  ambient.destroy()
    .then(() => {
      return res.send({
        status: 200,
        message: 'Ambient destroyed.'
      })
    })
}

async function update (req, res, next) {
  if (!utils.isUserAdmin(req.headers['x-access-token'])) {
    return next({
      status: 403,
      message: 'User is not admin.'
    })
  }
  /*
  const tokenData = utils.getUserData(req.headers['x-access-token'])
  const user = tokenData.user_id
  */
  const id = parseInt(req.params.id, 10)

  const slaves = req.body.slaves || []

  delete req.body.slaves

  const transaction = await sequelize.transaction()

  try {
    const ambient = await models.Ambients.findOne({
      where: {
        id: id
      }
    })

    if (!ambient) {
      throw new Error('Ambient not found')
    }

    const keys = _.keys(req.body)

    _.forEach(keys, key => {
      ambient.set(key, req.body[key])
    })

    await ambient.save({ transaction: transaction })
    await ambient.setSlaves([], { transaction: transaction })

    const newSlaves = await models.Slave.findAll({
      where: {
        id: {
          [Op.in]: slaves
        }
      },
      transaction: transaction
    })

    if (newSlaves.length < slaves.length) {
      throw new Error('Slave not found in list')
    }

    await Promise.all(_.map(newSlaves, slave => {
      return slave.addAmbient(ambient, {
        transaction: transaction
      })
    }))

    await transaction.commit()

    res.send(ambient)
  } catch (err) {
    transaction.rollback()

    return next({
      err: err.message,
      log: err
    })
  }
}

async function updateAmbientsOrder (req, res, next) {
  const ambients = req.body

  if (!ambients) {
    return res.send({
      status: 500,
      message: 'Error updating the ambients.'
    })
  }

  const ids = _.map(req.body, 'id')

  const dbAmbients = await models.Ambients.findAll({
    where: {
      id: ids
    }
  })

  await Promise.all(dbAmbients.map((ambient) => {
    const order = _.find(ambients, { id: ambient.id })
    if (!order) return Promise.resolve()

    ambient.order = order.order

    return ambient.save()
  }))

  return res.send({
    status: 200,
    message: 'OK'
  })
}

function create (req, res, next) {
  if (!utils.isUserAdmin(req.headers['x-access-token'])) {
    return next({
      status: 403,
      message: 'User is not admin.'
    })
  }

  const name = req.body.name
  let slaves = req.body.slaves
  if (!slaves) {
    slaves = []
  }

  sequelize.transaction()
    .then(transaction => {
      return models.Ambients.create({
        name: name
      }, {
        transaction: transaction
      })
        .then(ambient => {
          if (!ambient) {
            return next({
              status: 500,
              message: 'Error creating the ambient'
            })
          }

          return models.Slave.findAll({
            where: {
              id: {
                [Op.in]: slaves
              }
            },
            transaction: transaction
          })
            .then(_slaves => {
              if (_slaves.length < slaves.length) {
                throw new Error('Slave not found in list')
              }

              return Promise.all(_.map(_slaves, slave => {
                return slave.addAmbient(ambient, {
                  transaction: transaction
                })
              }))
                .then(() => {
                  return ambient
                })
            })
        })
        .then((ambient) => {
          transaction.commit()
          res.send(ambient)
        })
        .catch((err) => {
          console.log(err)
          transaction.rollback()
          return next({
            err: err.message,
            log: err
          })
        })
    })
}

async function patchMany (req, res, next) {
  if (!utils.isUserAdmin(req.headers['x-access-token'])) {
    return next({
      status: 403,
      message: 'User is not admin.'
    })
  }
  /*
  const tokenData = utils.getUserData(req.headers['x-access-token'])
  const user = tokenData.user_id
  */
  try {
    const ambients = _.forEach(
      req.body,
      async (obj) => {
        const ambient = await models.Ambients.findOne({ where: { id: obj.id } })
        delete obj.id
        const keys = _.keys(obj)
        _.forEach(keys, key => { ambient[key] = obj[key] })
        await ambient.save()
        return ambient
      }
    )
    return res.send(ambients)
  } catch (err) {
    return next({
      err: err.message,
      log: err
    })
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  destroy,
  updateAmbientsOrder,
  patchMany
}
