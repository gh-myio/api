'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    storage: './test.db',
    dialect: 'sqlite'
});

module.exports = {
    Channels: require('./channels')(sequelize),
    RfirDevices: require('./rfir_devices')(sequelize),
    Scenes: require('./scenes')(sequelize),
    Slave: require('./slave')(sequelize)
};
