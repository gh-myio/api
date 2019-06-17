let models        = require('../models').Models,
    sequelize     = require('../models').sequelize,
    Sequelize       = require('sequelize'),
    utils         = require('../utils');

const RESULTS_PER_PAGE = 50

let Op = Sequelize.Op;

async function findAll(req, res, next) {
    /*if (utils.isUserAdmin(req.headers['x-access-token'])) {
        return next({
            status: 403,
            message: 'User is not admin.'
        })
    }*/

    let page = req.params.page || 0

    try {
        let permissions = await models.Metadata.findAll({
            offset: page * RESULTS_PER_PAGE,
            limit: RESULTS_PER_PAGE,
            where: {
                type: req.params.type
            }
        })

        res.send(permissions.map(perm => {
            let data = perm.toJSON()

            return {
                ...data,
                data: JSON.parse(data.data || '{}')
            }
        }))
    } catch(e) {
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
