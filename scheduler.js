const scheduler = require('node-schedule')

let schedules = []
let ws
let scheduleTimer = null;

module.exports = {
  setSocket: (socket) => { ws = socket },
  setupEnergy: () => {},
  prepare: function() {
    const _ = require('lodash')
    const models = require('./lib/models').Models

    clearTimeout(scheduleTimer);

    if (schedules.length > 0) {
      schedules.forEach((schedule) => {
        if (!schedule) return

        schedule.cancel()
      })
    }

    const now = new Date().getTime();

    if (now < 1701302400000) {
      console.error('Time is in the past, trying to create schedules again in 5 seconds..')
      scheduleTimer = setTimeout(() => this.prepare(), 5000);
      return;
    }

    models.Schedule.findAll()
      .then((_schedules) => {
        console.log(`Scheduling ${_schedules.length} schedules.`)

        schedules = _.map(_schedules, (schedule) => {
          console.log(schedule.cron)
          return scheduler.scheduleJob({
            rule: schedule.cron,
            tz: 'America/Sao_Paulo'
          }, () => {
            console.log('Dispatching action', schedule.action)
            ws.send(JSON.stringify(schedule.action))
          })
        })
      })
  }
}
