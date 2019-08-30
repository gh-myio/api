const getmac = require('getmac')
const jwt = require('jsonwebtoken')
const ws = require('../WebSocketHandler')

function register (req, res, next) {
  getmac.getMac(function (err, macAddress) {
    if (err) throw err
    const mac = macAddress.replace(new RegExp(':', 'g'), '-')

    const token = jwt.sign({
      serial: mac
    }, global.privKey)

    return res.send({
      state: 'ok',
      signature: token
    })
  })
}

function factorySlave (req, res, next) {
  console.log('FACTORY', req.body)
  const addr = req.body.address
  const id = req.body.product_id
  const ir = req.body.ir_calibration
  ws.send(JSON.stringify({
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
