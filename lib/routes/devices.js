const models = require('../models').Models
const sequelize = require('../models').sequelize
const _ = require('lodash')

function destroy (req, res, next) {
  const id = req.params.id

  models.RfirDevices.findOne({
    where: {
      id: id
    }
  })
    .then(device => {
      if (!device) {
        return next({
          status: 404,
          message: 'Device not found'
        })
      }

      device.destroy()
        .then(() => {
          return res.send({
            status: 200,
            message: 'Device destroyed.'
          })
        })
    })
}

function update (req, res, next) {
  const id = parseInt(req.params.id, 10)

  sequelize.transaction()
    .then(transaction => {
      models.RfirDevices.findOne({
        where: {
          id: id
        },
        transaction: transaction
      })
        .then(device => {
          if (!device) {
            throw new Error('Device not found')
          }

          const keys = _.keys(req.body)
          _.forEach(keys, key => {
            let data = req.body[key]
            if (key === 'json' && typeof data === 'object') {
              data = JSON.stringify(data)
            }

            device.set(key, data)
          })

          return device.save({
            transaction: transaction
          })
        })
        .then((device) => {
          transaction.commit()
          return res.send(device)
        })
        .catch((err) => {
          return res.send({
            status: 500,
            message: 'Error updating the device.',
            err: err.message
          })
        })
    })
}

function create (req, res, next) {
  return sequelize.transaction()
    .then((transaction) => {
      let device
      return models.RfirDevices.create(req.body, {
        transaction: transaction
      })
        .then(_device => {
          device = _device
          if (!_device) {
            throw new Error('Error creating the device')
          }

          return models.RfirRemotes.create({
            name: `Controle  - ${device.name}`
          }, {
            transaction: transaction
          })
        })
        .then((remote) => {
          if (!remote) throw new Error('Error creating the remote')

          return device.addRfir_remotes([remote.id], {
            transaction: transaction
          })
        })
        .then((device) => {
          transaction.commit()
          res.json(device)
        })
        .catch(() => {
          transaction.rollback()

          return next({
            status: 500,
            message: 'Error creating the device'
          })
        })
    })
}

function findDevices (req, res, next) {
  const id = parseInt(req.params.id, 10)

  sequelize.transaction()
    .then((transaction) => {
      models.RfirDevices.findOne({
        attributes: [
          'id'
        ],
        where: {
          id: id
        },
        include: [{
          model: models.RfirRemotes,
          attributes: [
            'id',
            'name'
          ],
          include: [{
            model: models.RfirButtons,
            attributes: [
              'id',
              'name',
              'indexes',
              'color',
              'rfir_command_id'
            ]
          }]
        }],
        transaction: transaction
      })
        .then((rfirDevices) => {
          transaction.commit()
          if (!rfirDevices || !_.has(rfirDevices, 'rfir_remotes')) {
            res.status(404)
            return res.send({
              status: 404,
              message: 'Device not found'
            })
          }

          return res.send(rfirDevices.rfir_remotes)
        })
        .catch((err) => {
          res.status(500)

          return res.send({
            status: 500,
            message: 'There was an error finding the requested device',
            err: err.message
          })
        })
    })
}

module.exports = {
  findDevices: findDevices,
  create: create,
  destroy: destroy,
  update: update
}
