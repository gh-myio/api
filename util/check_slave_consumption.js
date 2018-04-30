let models = require('../lib/models').Models
let sequelize = require('../lib/models').sequelize
let Promise = require('bluebird')
let _ = require('lodash')
var PushBullet = require('pushbullet');
var pusher = new PushBullet('o.CzrvkpYEMStWfRjHhde9wXSuyrxo0kwm');
var OneSignal = require('onesignal-node');

let client = new OneSignal.Client({
	userAuthKey: 'OTU2NzNlODctOTEzMi00YWFiLTkxOTMtY2RkYzYwNmVjYmI4',
	// note that "app" must have "appAuthKey" and "appId" keys
	app: { appAuthKey: 'YjJhMzZhOTAtMzIwYy00YmJhLWIxMDctODg3OTlkNzViMGI3', appId: '008b6d6b-a74e-460c-80b6-ad481099fcc2' }
});

models.Slave.findAll()
  .then((slaves) => {
    let ids = _.map(slaves, 'id')

    return Promise.all(slaves.map((slave) => { 
      return sequelize.query(`
        SELECT * FROM consumption_realtime
        WHERE slave_id = ${slave.id}
        ORDER BY timestamp DESC
        LIMIT 1
      `, { type: sequelize.QueryTypes.SELECT})
      .then((consumption) => {
          return [slave, _.first(consumption)]
      })
    })).then((result) => {
      _.each(result, (data) => {
        console.log(data[1])
        if (data[1]) {
          let regularConsumption = data[0].regular_consumption
          if (data[1].value > 0 && data[1].value < (data[0].regular_consumption * 0.95)) {

            let acima = data[0].regular_consumption - data[1].value

            let firstNotification = new OneSignal.Notification({
                contents: {
                    en: `[${data[0].name}] Consumo abaixo da média! (${data[1].value}/${data[0].regular_consumption})`
                }
            });

            firstNotification.setIncludedSegments(['All']);

            client.sendNotification(firstNotification, function (err, httpResponse,data) {
               if (err) {
                   console.log('Something went wrong...');
               } else {
                   console.log(data, httpResponse.statusCode);
               }
            });
          } else if (data[1].value > 0 && data[1].value > (data[0].regular_consumption * 1.05)) {
            // Acima
            let firstNotification = new OneSignal.Notification({
                contents: {
                    en: `[${data[0].name}] Consumo acima da média! (${data[1].value}/${data[0].regular_consumption})`
                }
            });

            firstNotification.setIncludedSegments(['All']);

            client.sendNotification(firstNotification, function (err, httpResponse,data) {
               if (err) {
                   console.log('Something went wrong...');
               } else {
                   console.log(data, httpResponse.statusCode);
               }
            });
          }
        } else {
          console.log('No consumption historic data.')
        }
      })

      setTimeout(() => {
        process.exit(1)
      }, 10000)
    })
  })
