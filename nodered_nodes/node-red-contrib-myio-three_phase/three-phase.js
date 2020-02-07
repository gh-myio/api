module.exports = function (RED) {
  function ThreePhase (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      if (!msg.payload || msg.payload.message_type !== 'consumption') return
      if (msg.payload.phases) {
        const msgA = {
          payload: {
            ...msg.payload,
            value: msg.payload.phases.a,
            phases: undefined
          }
        }
        const msgB = {
          payload: {
            ...msg.payload,
            value: msg.payload.phases.b,
            phases: undefined
          }
        }
        const msgC = {
          payload: {
            ...msg.payload,
            value: msg.payload.phases.c,
            phases: undefined
          }
        }

        node.send([msgA, msgB, msgC])
      }
    })
  }

  RED.nodes.registerType('three-phase', ThreePhase)
}
