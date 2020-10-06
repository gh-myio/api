const jwt = require('jsonwebtoken')
const models = require('./models').Models
const Sequelize = require('sequelize')

const Op = Sequelize.Op

const methods = {
  isUserAdmin: (token) => {
    console.log('token: ', token)
    const userRole = methods.getUserRole(token)

    return userRole === 'admin'
  },
  getUserData: (token) => {
    return jwt.decode(token)
  },
  getUserRole: (token) => {
    console.log(token)
    const userData = methods.getUserData(token)
    console.log(userData)

    return userData.role || 'default'
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
  }
}

module.exports = methods
