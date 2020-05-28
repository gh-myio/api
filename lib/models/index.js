const _ = require('lodash')
const Sequelize = require('sequelize')
const dbConfig = require('../config')
const sequelize = new Sequelize(dbConfig)

const Models = {
  Channels: require('./channels')(sequelize),
  RfirDevices: require('./rfir_devices')(sequelize),
  RfirButtons: require('./rfir_buttons')(sequelize),
  RfirCommands: require('./rfir_commands')(sequelize),
  RfirRemotes: require('./rfir_remotes')(sequelize),
  Scenes: require('./scenes')(sequelize),
  Slave: require('./slave')(sequelize),
  Schedule: require('./schedule')(sequelize),
  Ambients: require('./ambients')(sequelize),
  Consumption: require('./consumption')(sequelize),
  RawEnergy: require('./raw_energy')(sequelize),
  Metadata: require('./metadata')(sequelize),
  Alarm: require('./alarms')(sequelize),
  ConsumptionAlerts: require('./consumption_alerts')(sequelize),
  AmbientPermissions: require('./ambient_permissions')(sequelize),
  User: require('./user')(sequelize),
  AlertHistory: require('./alert_history')(sequelize)
}

const keys = _.keys(Models)

_.each(keys, key => {
  const model = Models[key]

  if ('associate' in model) {
    return model.associate(Models)
  }
})

module.exports = {
  Models: Models,
  sequelize: sequelize
}
