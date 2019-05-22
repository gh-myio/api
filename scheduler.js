let { spawn } = require('child_process');
let scheduler = require('node-schedule');
let schedules = []
let ws

module.exports = {
    setSocket: (socket) => {
        ws = socket
    },
    setupEnergy: () => {
        console.log('DIRNAME', __dirname)
        // Schedule energy consumption aggregation
        let consumptionCron = '*/5 * * * *'

        // /opt/monorepo/consumption/consumption_aggregator.py >> /var/log/consumption.log 2>&1
        scheduler.scheduleJob(consumptionCron, () => {
            let cons = spawn('python', [`${__dirname}/consumption/consumption_aggregator.py`]);

            cons.stdout.on('data', (data) => {
              console.log(`Agreggator running: ${data}`);
            });

            cons.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });

            cons.on('close', (code) => {
              console.log(`Aggregator process exited with code ${code}`);
            });
        })
    },
    prepare: () => {
        let _ = require('lodash')
        let models = require('./lib/models').Models

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
