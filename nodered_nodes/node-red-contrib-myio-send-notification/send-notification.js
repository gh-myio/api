const jwt = require('jsonwebtoken')
const request = require('request')

module.exports = function (RED) {
  function SendNotification (config) {
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

      request.post(`${cloudUrl}/central/custom_push`, {
        json: {
          UUID: centralUUID,
          token: token,
          title: msg.payload.title,
          subtitle: msg.payload.subtitle,
          users: msg.payload.users
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

  RED.nodes.registerType('send-notification', SendNotification)
}
