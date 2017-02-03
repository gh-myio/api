'use strict';

const _         = require('lodash'),
    Sequelize   = require('sequelize'),
/*
    sequelize   = new Sequelize({
        storage: './test.db',
        dialect: 'sqlite'
    });
*/
    sequelize   = new Sequelize({
        "username": "docker",
        "password": "docker",
        "database": "hubot",
        "host": "localhost",
        "port": 25432,
        "dialect": "postgres"
    });

const Models = {
    Channels: require('./channels')(sequelize),
    RfirDevices: require('./rfir_devices')(sequelize),
    RfirButtons: require('./rfir_buttons')(sequelize),
    RfirCommands: require('./rfir_commands')(sequelize),
    RfirRemotes: require('./rfir_remotes')(sequelize),
    Scenes: require('./scenes')(sequelize),
    Slave: require('./slave')(sequelize),
    Ambients: require('./ambients')(sequelize)
};

let keys = _.keys(Models);

_.each(keys, key => {
    let model = Models[key];

    if ('associate' in model) {
        return model.associate(Models);
    }
});


module.exports = {
    Models: Models,
    sequelize: sequelize
}
