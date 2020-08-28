const sequelize = require('../models').sequelize
const { first } = require('lodash')

function getUsers (users) {
  if (!users) return ''
  if (users === 'all') return ''
  if (users.length && users.length > 0) {
    return 'AND "user" IN(:users)'
  }

  return ''
}

function getType (type) {
  if (!type) return ''
  if (type === 'all') return ''
  if (type.length && type.length > 0) {
    return 'AND type IN(:types)'
  }

  return ''
}

function getActionType (type) {
  if (!type) return ''
  if (type === 'all') return ''
  if (type.length && type.length > 0) {
    return 'AND action_type IN(:actionTypes)'
  }

  return ''
}

function getDevices (devices) {
  if (!devices) return ''
  if (devices === 'all') return ''

  if (devices.length && devices.length > 0) {
    return devices.reduce((acc, device, index, original) => {
      if (typeof device.slave_id === 'number') {

        let query = ''
        if (index === 0) {
          query += 'AND ('
        }

        query += `(slave_id = ${device.slave_id} `

        if (typeof device.channel === 'number') {
          query += `AND channel = ${device.channel})`
        } else {
          query += ')'
        }

        if (index < original.length - 1) {
          query += ' OR '
        }

        if (index === (original.length -1)) {
          query += ')'
        }

        return acc + query
      }

      return acc
    }, '')
  }

  return ''
}

async function queryAllData (req, res, next) {
  const body = req.body

  const userAnd = getUsers(body.users)
  const typeAnd = getType(body.type)
  const actionTypeAnd = getActionType(body.action_type)
  const devicesAnd = getDevices(body.devices)

  const dateStart = body.date_start
  const dateEnd = body.date_end

  const query = `
      SELECT * FROM public.logs
       WHERE timestamp >= :dateStart
         AND timestamp < :dateEnd
             ${userAnd}
             ${typeAnd}
             ${actionTypeAnd}
             ${devicesAnd}
    ORDER BY timestamp DESC
    `

  console.log(query)

  const data = await sequelize.query(query, {
    replacements: {
      dateStart,
      dateEnd,
      types: body.type,
      users: body.users,
      actionTypes: body.action_type
    },
    mapToModel: false
  })

  res.send(first(data))
}

module.exports = { queryAllData }
