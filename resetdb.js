'use strict';

const models = require('./lib/models');

models.sequelize.sync({
    force: true
}).then(function() {
    console.log('done');
});
