const jwt = require('jsonwebtoken')
const models = require('../models').Models
const bcrypt = require('bcryptjs')

function getLocalToken (req, res, next) {
  const privateKey = global.privKey
  const token = jwt.sign({
    UUID: '92e916b9-9517-4c88-853d-9c9f6f052afe',
    role: 'admin',
    name: 'Myio Local',
    user_id: '92e916b9-9517-4c88-853d-9c9f6f052afe',
    localOnly: true
  }, privateKey)

  res.send({
    token,
    centralUUID: global.centralUUID
  })
}

function _verifyPassword (reqPassword, userPassword) {
  return bcrypt.compare(userPassword, reqPassword)
}

async function auth (req, res, next) {
  const { email, password } = req.body
  const user = await models.User.scope('login').findOne({
    where: { email }
  })

  if (!user) throw new Error('User not found.')

  const validPassword = await _verifyPassword(user.password, password)

  if (!validPassword) {
    throw new Error('Unauthorized')
  }

  const privateKey = global.privKey
  const token = jwt.sign({
    UUID: global.centralUUID,
    role: 'admin',
    name: 'Myio Local',
    user_id: user.UUID,
    localOnly: true
  }, privateKey)

  res.send({
    token,
    centralUUID: global.centralUUID
  })
}

module.exports = {
  getLocalToken,
  auth
}
