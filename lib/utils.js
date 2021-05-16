const jwt = require('jsonwebtoken')
const models = require('./models').Models
const Sequelize = require('sequelize')

const Op = Sequelize.Op

const methods = {
  isUserAdmin: (token) => (methods.getUserRole(token) === 'admin'),
  getUserData: (token) => (jwt.decode(token)),
  getUserRole: (token) => {
    const { role } = methods.getUserData(token) || {}
    return role || 'default'
  },
  getUserAllowedAmbients: async (token) => {
    const userData = methods.getUserData(token)
    const user = userData.user_id
    let ambients = []

    if (userData.role === 'admin') {
      ambients = await models.Ambients.findAll()
    } else {
      const userPermissions = await models.AmbientPermissions.findAll({
        where: {
          user
        }
      })

      ambients = await models.Ambients.findAll({
        where: {
          id: {
            [Op.in]: userPermissions.map(p => p.ambientId)
          }
        }
      })
    }

    return ambients.map(a => a.id)
  },
  isModified: (req, res, date) => {
    const lastModifiedDate = new Date(date)
    res.setHeader('Last-Modified', lastModifiedDate.toUTCString())
    const ifModfiedSince = new Date(req.headers['if-modified-since'])
    if (req.method === 'HEAD' || (ifModfiedSince >= lastModifiedDate.setMilliseconds(0))) {
      return false
    }
    return true
  }
}

module.exports = methods
