'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash');

function findAll(req, res, next) {
    return models.Slave.findAll()
        .then(slaves => {
            res.send(slaves);
        });
}

function create(req, res, next) {
    return models.Slave.create(req.body)
        .then(slave => {
            res.send(slave);
        });
}

module.exports = {
    create: create,
    findAll: findAll
};
