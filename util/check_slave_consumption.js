let models = require('../lib/models').Models
let sequelize = require('../lib/models').sequelize
let Promise = require('bluebird')
let _ = require('lodash')
var PushBullet = require('pushbullet');
var pusher = new PushBullet('o.CzrvkpYEMStWfRjHhde9wXSuyrxo0kwm');

models.Slave.findAll()
  .then((slaves) => {
    let ids = _.map(slaves, 'id')

    return Promise.all(slaves.map((slave) => { 
      return sequelize.query(`
        SELECT * FROM consumption_realtime
        WHERE slave_id IN (${ids.join(', ')})
        ORDER BY timestamp DESC
        LIMIT 1
      `, { type: sequelize.QueryTypes.SELECT})
        .then((consumption) => {
        })
        /*return models.RawEnergy.findAll({
        where: {
          'slave_id': {
            $in: ids
          }
        },
        order: [
          ['datetime', 'DESC']
        ],
        limit: 1
      })*/.then((consumption) => {
          return [slave, _.first(consumption)]
      })
    })).then((result) => {
      _.each(result, (data) => {
        if (data[1]) {
          let regularConsumption = data[0].regular_consumption
          if (data[1].value > 0 && data[1].value < (data[0].regular_consumption * 0.95) ||
            data[1].value > (data[0].regular_consumption * 1.05)) {

            let acima = data[0].regular_consumption - data[1].value
            pusher.note('ujyaht1Vqw0sjz4DyooA5A', `[${data[0].name}] Consumo abaixo da média! (${data[1].value}/${data[0].regular_consumption})`, data[0].name, function(error, response) {
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
