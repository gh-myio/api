let models = require('../lib/models').Models
let Promise = require('bluebird')
let _ = require('lodash')
var PushBullet = require('pushbullet');
var pusher = new PushBullet('o.CzrvkpYEMStWfRjHhde9wXSuyrxo0kwm');

models.Slave.findAll()
  .then((slaves) => {
    let ids = _.map(slaves, 'id')

    return Promise.all(slaves.map((slave) => { 
      return models.RawEnergy.findAll({
        where: {
          'slave_id': {
            $in: ids
          }
        },
        order: [
          ['datetime', 'DESC']
        ],
        limit: 1
      }).then((consumption) => {
          return [slave, _.first(consumption)]
      })
    })).then((result) => {
      return _.each(result, (data) => {
        if (data[1]) {
          let regularConsumption = data[0].regular_consumption
          if (data[1].value > 0 && data[1].value < data[0].regular_consumption) {
            let acima = data[0].regular_consumption - data[1].value
            console.log('ALERT !!!!')
            pusher.note('ujyaht1Vqw0sjz4DyooA5A', data[0].name, `Consumo abaixo da média! (${data[1].value}/${data[0].regular_consumption})`, function(error, response) {
              console.log(error);
              console.log(response)
            });
          } else {
            console.log('REGULAR !!!')
            console.log(data[1].value, data[0].regular_consumption)
          }
        } else {
          console.log('No consumption historic data.')
        }
      })
    })
  })
