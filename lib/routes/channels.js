const models = require('../models').Models
const sequelize = require('../models').sequelize
const Promise = require('bluebird')
const _ = require('lodash')
const CACHE = require('../Cache.js')

function findById (req, res, next) {
  const id = req.params.id

  models.Channels.findOne({
    where: {
      id: id
    }
  })
    .then(channels => {
      if (!channels) {
        return next({
          status: 404,
          message: 'Channel not found'
        })
      }

      return res.send(channels)
    })
    .catch((err) => {
      return next({
        err: err,
        log: err
      })
    })
}

function destroy (req, res, next) {
  const id = req.params.id

  models.Channels.findOne({
    where: {
      id: id
    }
  })
    .then(channel => {
      if (!channel) {
        return next({
          status: 404,
          message: 'Channel not found'
        })
      }

      channel.destroy()
        .then(() => {
          CACHE.resetSlaves()
          return res.send({
            status: 200,
            message: 'Channel destroyed.'
          })
        })
    })
}

function update (req, res, next) {
  const id = parseInt(req.params.id, 10)
  const data = req.body

  models.Channels.findOne({
    where: {
      id: id
    }
  }).then((channel) => {
    const keys = Object.keys(data)

    _.forEach(keys, key => {
      channel.set(key, req.body[key])
    })
    channel.save()
    CACHE.resetSlaves()
    return channel
  })
    .then(channel => res.send(channel))
    .catch((err) => {
      return next({
        err: err.message,
        log: err
      })
    })
}

async function create (req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    models.Channels.create({
      type: req.body.type,
      channel: req.body.channel,
      name: req.body.name,
      slave_id: req.body.slave_id,
      scene_up_id: req.body.scene_up_id,
      scene_down_id: req.body.scene_down_id,
      channel_id: req.body.channel_id
    }, {
      transaction: transaction
    }).then((channel) => {
      return Promise.resolve(channel)
    })
      .then(channel => {
        if (!channel) {
          throw new Error('Error creating the channel')
        }
        transaction.commit()
        CACHE.resetSlaves()
        return res.send(channel)
      })
  } catch (err) {
    transaction.rollback()
    return next({
      err: err.message,
      log: err
    })
  }
}

module.exports = {
  findById: findById,
  create: create,
  update: update,
  destroy: destroy
}
