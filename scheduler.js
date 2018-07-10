let schedules = []
let ws

module.exports = {
    setSocket: (socket) => {
        ws = socket
    },
    prepare: () => {
        let scheduler = require('node-schedule');
        let _ = require('lodash')
        let models = require('./lib/models').Models

        if (schedules.length > 0) {
            schedules.forEach((schedule) => {
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
