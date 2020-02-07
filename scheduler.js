const scheduler = require('node-schedule')
let schedules = []
let ws

module.exports = {
  setSocket: (socket) => { ws = socket },
  setupEnergy: () => {},
  prepare: () => {
    const _ = require('lodash')
    const models = require('./lib/models').Models

    if (schedules.length > 0) {
      schedules.forEach((schedule) => {
        if (!schedule) return

        schedule.cancel()
      })
    }

    models.Schedule.findAll()
      .then((_schedules) => {
        console.log(`Scheduling ${_schedules.length} schedules.`)

        schedules = _.map(_schedules, (schedule) => {
          console.log(schedule.cron)
          return scheduler.scheduleJob(schedule.cron, () => {
            console.log('Dispatching action', schedule.action)
            ws.send(JSON.stringify(schedule.action))
          })
        })
      })
  }
}
