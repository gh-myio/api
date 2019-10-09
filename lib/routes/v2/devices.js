const models = require('../../models').Models
const _ = require('lodash')

async function findDevices (req, res, next) {
  try {
    const id = parseInt(req.params.id, 10)
    const device = await models.RfirDevices.findOne({
      attributes: ['id'],
      where: { id: id },
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
            'rfir_command_id',
            'type',
            'single_send'
          ]
        }]
      }]
    })

    if (!device || !_.has(device, 'rfir_remotes')) {
      res.status(404)

      return res.send({
        status: 404,
        message: 'Device not found'
      })
    }

    res.send(device.rfir_remotes)
  } catch (err) {
    console.log(err)
    res.status(500)

    return res.send({
      status: 500,
      message: 'There was an error finding the requested device',
      err: err.message
    })
  }
}

module.exports = {
  findDevices
}
