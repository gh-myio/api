let models        = require('../models').Models,
    sequelize     = require('../models').sequelize,
    Sequelize       = require('sequelize'),
    utils         = require('../utils');

let Op = Sequelize.Op;

async function findAll(req, res, next) {
    try {
        let permissions = await models.AmbientPermissions.findAll()

        res.send(permissions)
    } catch(e) {
        console.log(e)
        next({
            status: 500,
            message: 'Error querying ambient permissions'
        })
    }
}

async function getUserAmbients(req, res, next) {
    if (!utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    }

    let userId = req.params.userId

    try {
        let ambients = await models.AmbientPermissions.findAll({
            where: {
                user: userId
            },
            include: [models.Ambients]
        })

        res.send(ambients)
    } catch(e) {
        return next({
            status: 500
        })
    }
}

async function create(req, res, next) {
    if (!utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    }

    let ambients = req.body.ambients
    let userId = req.body.userId
    let expires = req.body.expires

    try {
        // Remove existing user permissions
        await models.AmbientPermissions.destroy({
            where: {
                user: userId
            }
        })

        let payload = ambients.map(ambient => {
            return {
                expires,
                ambientId: ambient,
                user: userId
            }
        })

        if (payload.length === 0) return res.send([])

        let permissions = await models.AmbientPermissions.bulkCreate(payload)

        return res.send(permissions)
    } catch(e) {
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
