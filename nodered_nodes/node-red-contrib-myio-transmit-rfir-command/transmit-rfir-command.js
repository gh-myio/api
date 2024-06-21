const models = require('../../lib/models').Models
const WebSocketHandler = require('../../lib/WebSocketHandler')

module.exports = function (RED) {
  function TransmitRfirCommand (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      const slaveId = RED.util.evaluateNodeProperty(config.slave, config.slaveType, node, msg)
      const rfirCommandId = RED.util.evaluateNodeProperty(config.command, config.commandType, node, msg)

      const wsPayload = {
        type: 'slave',
        id: parseInt(slaveId),
        command: 'transmit',
        rfir_command_id: parseInt(rfirCommandId)
      }

      WebSocketHandler.send(JSON.stringify(wsPayload))
    })
  }

  RED.nodes.registerType('transmit-rfir-command', TransmitRfirCommand)

  RED.httpAdmin.get('/v0/rfir_commands', async (req, res) => {
    const slaves = await models.Slave.findAll({
      include: [{
        as: 'devices',
        model: models.RfirDevices,
        required: true,
        include: [{
          // as: 'remotes',
          model: models.RfirRemotes,
          required: true,
          include: [{
            // as: 'buttons',
            model: models.RfirButtons,
            required: true,
            include: [{
              // as: 'command',
              required: true,
              model: models.RfirCommands
            }]
          }]
        }]
      }]
    })

    res.send(slaves)
  })
}
