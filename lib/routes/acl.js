const jwt = require('jsonwebtoken')

function getLocalToken(req, res, next) {
    const privateKey = global.privKey
    const token = jwt.sign({
        UUID: '92e916b9-9517-4c88-853d-9c9f6f052afe',
        localOnly: true
    }, privateKey)

    res.send({
        token
    })
}

module.export = {
    getLocalToken
}
