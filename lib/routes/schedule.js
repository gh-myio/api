'use strict';

const models        = require('../models').Models,
      sequelize     = require('../models').sequelize,
      Promise       = require('bluebird'),
      _             = require('lodash'),
      ws            = require('../WebSocketHandler');

function findAll(req, res, next) {
    models.Schedule.findAll()
        .then(schedules => {
            if (!schedules) {
                return res.send([]);
            }

            let json = _.map(schedules, schedule => {
                let s = schedule.toJSON();
                if (typeof s.action === 'string') {
                    s.action = JSON.parse(s.action);
                }

                return s;
            });

            return res.send(json);
        });
}

function findById(req, res, next) {
    let id = req.params.id;

    models.Schedule.findOne({
        where: {
            id: id
        }
    })
    .then(schedule => {
        if (!schedule) {
            return res.send({
                status: 404,
                message: 'Schedule not found'
            });
        }

        return res.send(schedule);
    });
}

function destroy(req, res, next) {
    let id = req.params.id;

    models.Schedule.findOne({
        where: {
            id: id
        }
    })
    .then(schedule => {
        if (!schedule) {
            return res.send({
                status: 404,
                message: 'Schedule not found'
            });
        }

        schedule.destroy()
            .then(() => {
                return res.send({
                    status: 200,
                    message: 'Schedule destroyed.'
                });
            });
    });
}

function update(req, res, next) {
    let id = parseInt(req.params.id, 10);

    sequelize.transaction()
        .then(transaction => {
            models.Schedule.findOne({
                where: {
                    id: id
                },
                transaction: transaction
            })
            .then(schedule => {
                if (!schedule) {
                    throw new Error('Schedule not found');
                }

                let keys = _.keys(req.body);

                _.forEach(keys, key => {
                    let data = req.body[key];

                    schedule.set(key, data);
                });

                return schedule.save({
                    transaction: transaction
                });
            })
            .then((schedule) => {
                transaction.commit()
                    .then(() => {
                        return res.send(schedule);
                    })
            }).catch((err) => {
                transaction.rollback()

                return res.send({
                    status: 500,
                    message: 'Error updating the schedule.',
                    err: err.message
                });
            });
        });
}

function create(req, res, next) {
    req.body.json = req.body.json ? JSON.stringify(req.body.json) : req.body.json;

    sequelize.transaction()
        .then(transaction => {
            return models.Schedule.create(req.body, {
                transaction: transaction
            })
            .then(schedule => {
                if (!schedule) {
                    throw new Error('Unable to create the Schedule');
                }

                transaction.commit()
                    .then(() => {
                        return res.send(schedule);
                    });
            })
            .catch((err) => {
                console.log(err);
                transaction.rollback();
                res.send({
                    status: 500,
                    message: 'Error creating the schedule',
                    err: err.message
                });
            });
        });
}

module.exports = {
    findAll: findAll,
    findById: findById,
    create: create,
    update: update,
    destroy: destroy
};
