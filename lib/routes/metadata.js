const models = require('../models').Models
const Sequelize = require('sequelize')

const RESULTS_PER_PAGE = 50

const Op = Sequelize.Op

async function findAll (req, res, next) {
  /* if (utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    } */

  const page = req.params.page || 0

  try {
    const permissions = await models.Metadata.findAll({
      offset: page * RESULTS_PER_PAGE,
      limit: RESULTS_PER_PAGE,
      order: [
        ['timestamp', 'DESC']
      ],
      where: {
        type: {
          [Op.in]: ['user_action', 'manual_action']
        }
      }
    })

    res.send(permissions.map(perm => {
      const data = perm.toJSON()

      return {
        ...data,
        data: JSON.parse(data.data || '{}')
      }
    }))
  } catch (e) {
    console.log(e)
    next({
      status: 500,
      message: 'Error querying ambient permissions'
    })
  }
}

module.exports = {
  findAll
}
