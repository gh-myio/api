'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      async         = require('async'),
      _             = require('lodash');


function findById(req, res, next) {
    let id = req.params.id;

    models.Channels.find({
        where: {
            id: id
        }
    })
    .then(channels => {
        if (!channels) {
            return next({
                status: 404,
                message: 'Channel not found'
            });
        }

        return res.send(channels);
    })
    .catch((err) => {
        return next({
            err: err,
            log: err
        });
    });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.Channels.find({
        where: {
            id: id
        }
    })
    .then(channel => {
        if (!channel) {
            return next({
                status: 404,
                message: 'Channel not found'
            });
        }

        channel.destroy()
            .then(() => {
                return res.send({
                    status: 200,
                    message: 'Channel destroyed.'
                });
            });
    });
}

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);
    let data = req.body;

    models.Channels.find({
        where: {
            id: id
        }
    }).then((channel) => {
        let keys = Object.keys(data);

        _.forEach(keys, key => {
            channel.set(key, req.body[key]);
        });

        return channel.save();
    })
    .then((channel) => {
        return res.send(channel);
    })
    .catch((err) => {
        return next({
            err: err.message,
            log: err
        });
    });

}

function create(req, res, next) {
    return models.Channels.create({
        type: req.body.type,
        channel: req.body.channel,
        name: req.body.name,
        description: req.body.description,
        slave_id: req.body.slave_id
    })
    .then(channel => {
        if (!channel) {
            return next({
                status: 500,
                message: 'Error creating the channel'
            });
        }

        return res.send(channel);
    })
    .catch((err) => {
        return next({
            err: err.message,
            log: err
        });
    });
}

module.exports = {
    findById: findById,
    create: create,
    update: update,
    destroy: destroy
};
