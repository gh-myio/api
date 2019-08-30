const models = require('../models').Models
const utils = require('../utils')

async function findAll (req, res, next) {
  try {
    const permissions = await models.AmbientPermissions.findAll()

    res.send(permissions)
  } catch (e) {
    console.log(e)
    next({
      status: 500,
      message: 'Error querying ambient permissions'
    })
  }
}

async function getUserAmbients (req, res, next) {
  if (!utils.isUserAdmin(req.headers['x-access-token'])) {
    return next({
      status: 403,
      message: 'User is not admin.'
    })
  }

  const userId = req.params.userId

  try {
    const ambients = await models.AmbientPermissions.findAll({
      where: {
        user: userId
      },
      include: [models.Ambients]
    })

    res.send(ambients)
  } catch (e) {
    return next({
      status: 500
    })
  }
}

async function create (req, res, next) {
  if (!utils.isUserAdmin(req.headers['x-access-token'])) {
    return next({
      status: 403,
      message: 'User is not admin.'
    })
  }

  const ambients = req.body.ambients
  const userId = req.body.userId
  const expires = req.body.expires

  try {
    // Remove existing user permissions
    await models.AmbientPermissions.destroy({
      where: {
        user: userId
      }
    })

    const payload = ambients.map(ambient => {
      return {
        expires,
        ambientId: ambient,
        user: userId
      }
    })

    if (payload.length === 0) return res.send([])

    const permissions = await models.AmbientPermissions.bulkCreate(payload)

    return res.send(permissions)
  } catch (e) {
    return next({
      status: 500
    })
  }
}

module.exports = {
  findAll,
  create,
  getUserAmbients
}
