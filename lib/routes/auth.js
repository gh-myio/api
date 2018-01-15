'use strict';

const Promise       = require('bluebird'),
    async           = require('async'),
    _               = require('lodash'),
    getmac          = require('getmac'),
    jwt             = require('jsonwebtoken');

function register(req, res, next) {
    getmac.getMac(function(err,macAddress){
        if (err) throw err
        let mac = macAddress.replace(new RegExp(':', 'g'),'-');

        let token = jwt.sign({
            serial: mac
        }, global.privKey);

        return res.send({
            state: 'ok',
            signature: token
        })
    })
}


module.exports = {
    register: register,
};
