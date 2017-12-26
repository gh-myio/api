'use strict'

const _         = require('lodash'),
    Sequelize   = require('sequelize'),
    dbConfig    = require('../config').db,
    sequelize   = new Sequelize(dbConfig)

const Models = {
    Channels: require('./channels')(sequelize),
    RfirDevices: require('./rfir_devices')(sequelize),
    RfirButtons: require('./rfir_buttons')(sequelize),
    RfirCommands: require('./rfir_commands')(sequelize),
    RfirRemotes: require('./rfir_remotes')(sequelize),
    Scenes: require('./scenes')(sequelize),
    Slave: require('./slave')(sequelize),
    Ambients: require('./ambients')(sequelize),
    Consumption: require('./consumption')(sequelize),
    RawEnergy: require('./raw_energy')(sequelize),
    Metadata: require('./metadata')(sequelize)
}

let keys = _.keys(Models)

_.each(keys, key => {
    let model = Models[key]

    if ('associate' in model) {
        return model.associate(Models)
    }
})


module.exports = {
    Models: Models,
    sequelize: sequelize
}
