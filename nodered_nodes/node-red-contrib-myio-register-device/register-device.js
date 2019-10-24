const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function RegisterDevice (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const nodeContext = node.context()

    node.on('input', function (msg) {
      if (!msg.payload) return
      let registered = false

      let code = msg.payload.factory_address.replace(/ /g, '') // code (3, 5, 7, 8)

      code = code.split(',').map(number => parseInt(number))

      // WebSocketHandler.once('')
      const payload = {
        'type': 'admin',
        'command': 'add_slave',
        'factory_address': code
      };

      WebSocketHandler.send(JSON.stringify(payload))

      WebSocketHandler.on('admin', (message) => {
        if (registered) return
        if (message.command === 'push_button') {
          let slaveType = 'outlet'

          switch (code[3]) {
            case 12:
              slaveType = 'outlet';
              break;
            case 14:
              slaveType = 'infrared';
              break;
            case 15:
              slaveType = 'three_phase_sensor';
              break;
          }

          const buttonlessRegisterPayload = {
            'type': 'admin',
            'command': 'buttonless_register',
            'slave_type': slaveType,
            'idl': message.address[1],
            'idh': message.address[0]
          }

          setTimeout(() => {
            WebSocketHandler.send(JSON.stringify(buttonlessRegisterPayload))
          }, 100)

          WebSocketHandler.once('admin', async (message) => {
            if (registered) return
            if (message.command === 'success') {
              registered = true

              const slave = await models.Slave.create({
                addr_low: message.address[1],
                addr_high: message.address[0],
                type: message.slave_type,
                name: `${message.slave_type} — ${message.address[0]}`,
                channels: message.channels,
                code: code.join(''),
                version: '2.0.0'
              })

              if (slave.type === 'outlet') {
                for (let i = 0; i < message.channels; i++) {
                  await models.Channels.create({
                    type: 'lamp',
                    channel: i,
                    name: `Channel ${i}`,
                    slave_id: slave.id,
                    scene_id: undefined,
                    channel_id: undefined
                  })
                }
              }


              WebSocketHandler.send(JSON.stringify({
                type: 'admin',
                command: 'start_slave',
                id: slave.id
              }))

              msg.payload = {
                ...msg.payload,
                slave
              }

              node.send([msg])
            }
          })
        }
      })
    })
  }

  RED.nodes.registerType('register-device', RegisterDevice)
}
