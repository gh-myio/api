let jwt = require('jsonwebtoken');
let models = require('./models').Models;
let Sequelize = require('sequelize');

let Op = Sequelize.Op;

let methods = {
    isUserAdmin: (token) => {
        let userRole = methods.getUserRole(token)

        return userRole === 'admin'
    },
    getUserData: (token) => {
        return jwt.decode(token)
    },
    getUserRole: (token) => {
        console.log(token)
        let userData = methods.getUserData(token)
        console.log(userData)

        return userData.role || 'default'
    },
    getUserAllowedAmbients: async (token) => {
        let userData = methods.getUserData(token)
        let user = userData.user_id
        let ambients = []

        if (userData.role === 'admin') {
            ambients = await models.Ambients.findAll()
        } else {
            let userPermissions = await models.AmbientPermissions.findAll({
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
