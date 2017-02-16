'use strict';

const models = require('./lib/models');

models.sequelize.sync({
    force: true,
    logging: console.log
}).then(function() {
    console.log('done');
});
