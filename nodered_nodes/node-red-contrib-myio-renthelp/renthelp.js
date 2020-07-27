const net = require('net')
const PACKET_SIZE = '07'
const AUTH_COMMAND = '94'
const AUTH_METHOD = '45'

const CONN_METHOD = 11
const MESSAGE_TYPE = '18'

const EVENT_TYPES = {
  CONSUMPTION_ZERO: '700',
  CONSUMPTION_OVER: '703',
  CONSUMPTION_UNDER: '704',
  CONSUMPTION_USE_HOURS: '701',
  USE_HOURS: '702',
  NO_COMM: '705',
  SENSOR_DETECTED: '706'
}

module.exports = function (RED) {
  function RentHelp (config) {
    RED.nodes.createNode(this, config)

    const node = this

    node.on('input', function (msg) {
      sendMessage(
        config.port,
        config.ip,
        config.clientId,
        config.centralId,
        msg.payload.type === 'created' ? '1' : '3',
        getEventType(msg.payload.alarm_type),
        config.partition,
        `${msg.payload.id}`.padStart(3, '0')
      )
    })
  }

  RED.nodes.registerType('renthelp', RentHelp)
}

function getEventType (eventType) {
  if (!Object.prototype.hasOwnProperty.call(EVENT_TYPES, eventType)) throw new Error('Invalid event type')

  return EVENT_TYPES[eventType]
}

function sendMessage (port, ip, clientId, centralId, eventType, eventCode, partition, aux) {
  const payload = createAuthPayload(clientId, centralId)
  const contactIdPayload = createContactIdPayload(clientId, eventType, eventCode, partition, aux)

  const client = new net.Socket()

  client.connect(port, ip, function () {
    client.write(payload, 'hex')
    client.write(createEventData('11', 'B0', contactIdPayload), 'hex')

    client.destroy()
  })
}

function createAuthPayload (clientId, centralId) {
  return PACKET_SIZE + AUTH_COMMAND + AUTH_METHOD + clientId + centralId
}

function factoryEvent (accountId, dataType, qualifier, eventCode, partition, helpId) {
  let partitionArray = [...partition]
  let helpIdArray = [...helpId]

  helpIdArray = helpIdArray.map((char) => {
    return char === '0' ? 'A' : char
  })

  partitionArray = partitionArray.map(function (char) {
    return char === '0' ? 'A' : char
  })

  var allInfo = [...accountId, ...dataType, ...qualifier, ...eventCode, ...partitionArray, ...helpIdArray]
  var checkSum = generateCheckSumEvent(allInfo)

  return '0' + allInfo.join('0') + checkSum
}

function createEventData (sizeData, command, contaIdEvent) {
  return sizeData + command + contaIdEvent
}

function generateCheckSumEvent (eventCharArray) {
  var sun = eventCharArray.reduce((total, value) => {
    return value === 'A' || value === '0' ? Number(total) + 10 : Number(total) + Number(value)
  }, 0)

  var multiple = calculateMultiple(sun)
  return multiple - sun >= 10 ? multiple - sun : ('0' + (multiple - sun))
}

function calculateMultiple (sun) {
  var multiple = 0
  var int = 1

  while (multiple === 0) {
    if (int * 15 > sun) {
      multiple = int * 15
    }
    int++
  }

  return multiple
}

/*
 * eventType: ALARMED, NOT_ALARMED
 * eventCode: CONSUMPTION_OVER, CONSUMPTION_ZERO, CONSUMPTION_USE_HOURS
 */
function createContactIdPayload (clientId, eventType, eventCode, partition, aux) {
  var contactIdEvent = factoryEvent(clientId, MESSAGE_TYPE, eventType, eventCode, partition, aux)

  return CONN_METHOD + contactIdEvent
}
