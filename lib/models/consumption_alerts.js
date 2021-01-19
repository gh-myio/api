const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  const Model = sequelize.define('consumption_alerts', {
    name: Sequelize.STRING,
    slave_id: Sequelize.INTEGER,
    type: Sequelize.STRING,
    extra: Sequelize.TEXT
  }, {
    timestamps: false,
    underscored: true
  })

  Model.associate = (models) => {
    Model.belongsTo(models.Channels)
    Model.belongsTo(models.Slave, {
      foreignKey: 'slave_id',
      onDelete: 'SET NULL'
    })
  }

  return Model
}

/*
 * Examples:
 *
 * # CONSUMPTION_USE_HOURS:
 * {
 * "slave_id": 3,
 * "type": 'USE_HOURS',
 *  "extra": {
 *    "standBy": 180, // 180 W
 *    "weekDays": [{
 *      "week_day": 1,
 *      "start_hour": 6,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [06:00 - 07:20am]
 *    }, {
 *      "week_day": 2,
 *      "start_hour": 23,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [23:00pm - 00:20am]
 *    }]
 *  }
 * }
 *
 * # USE_HOURS
 * {
 *  slave_id: 3,
 *  type: 'USE_HOURS',
 *  extra: {
 *    "channel": 0,
 *    "value": 0, // Turned off
 *    "weekDays": [{
 *      "week_day": 1,
 *      "start_hour": 6,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [06:00 - 07:20am]
 *    }, {
 *      "week_day": 2,
 *      "start_hour": 23,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [23:00pm - 00:20am]
 *    }]
 *  }
 * }
 *
 * # CONSUMPTION_OVER
 * {
 *  slave_id: 3,
 *  type: 'CONSUMPTION_OVER',
 *  extra: {
 *    "value": 300, // >= 300
 *    "weekDays": [{
 *      "week_day": 1,
 *      "start_hour": 6,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [06:00 - 07:20am]
 *    }, {
 *      "week_day": 2,
 *      "start_hour": 23,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [23:00pm - 00:20am]
 *    }]
 *  }
 * }
 *
 * # CONSUMPTION_ZERO
 * {
 *  slave_id: 3,
 *  type: 'CONSUMPTION_ZERO',
 *  extra: {
 *    "weekDays": [{
 *      "week_day": 1,
 *      "start_hour": 6,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [06:00 - 07:20am]
 *    }, {
 *      "week_day": 2,
 *      "start_hour": 23,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [23:00pm - 00:20am]
 *    }]
 *  }
 *
 * # NO_COMM
 * {
 *  slave_id: 3,
 *  type: 'NO_COMM',
 *  extra: {
 *    "weekDays": [{
 *      "week_day": 1,
 *      "start_hour": 6,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [06:00 - 07:20am]
 *    }, {
 *      "week_day": 2,
 *      "start_hour": 23,
 *      "start_minute": 0,
 *      "offset_minutes": 80 // [23:00pm - 00:20am]
 *    }]
 *  }
 */
