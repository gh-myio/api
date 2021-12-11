const jwt = require('jsonwebtoken')

function register (req, res, next) {
  const token = jwt.sign({
    serial: global.centralSerial
  }, global.privKey)

  return res.send({
    state: 'ok',
    signature: token
  })
}

function factorySlave (req, res, next) {
  console.log('FACTORY', req.body)
  const addr = req.body.address
  const id = req.body.product_id
  const ir = req.body.ir_calibration

  require('../WebSocketHandler').send(JSON.stringify({
    type: 'admin',
    command: 'factory_slave',
    address: addr,
    product_id: id,
    ir_calibration: ir
  }))

  return res.send('reply')
}

module.exports = {
  register,
  factorySlave
}
