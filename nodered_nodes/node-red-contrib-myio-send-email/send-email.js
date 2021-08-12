const jwt = require('jsonwebtoken')
const request = require('request')

module.exports = function (RED) {
  function SendEmail (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      const cloudUrl = global.cloudUrl
      const centralUUID = global.centralUUID
      const token = jwt.sign({
        UUID: global.centralUUID
      }, global.privKey)

      const headers = {
        'x-access-token': token,
        central_id: centralUUID
      }

      request.post(`${cloudUrl}/central/email`, {
        json: {
          to: msg.payload.to,
          title: msg.payload.title,
          template: msg.payload.template
        },
        headers
      }, (error, res, body) => {
        if (error) {
          console.error(error)

          return
        }

        console.log(`statusCode: ${res.statusCode}`)
        console.log(body)
      })
    })
  }

  RED.nodes.registerType('send-email', SendEmail)
}
