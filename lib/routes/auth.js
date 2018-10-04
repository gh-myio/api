'use strict';

const Promise       = require('bluebird'),
    async           = require('async'),
    _               = require('lodash'),
    getmac          = require('getmac'),
    jwt             = require('jsonwebtoken'),
    ws              = require('../WebSocketHandler');

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

function factory_slave(req, res, next) {
    console.log('FACTORY', req.body);
    let addr = req.body.address;
    let id = req.body.product_id;
    let ir = req.body.ir_calibration;
    ws.send(JSON.stringify({
        type: 'admin',
        command: 'factory_slave',
        address: addr,
        product_id: id,
        ir_calibration: ir
    }));
    return res.send('reply');
}


module.exports = {
    register: register,
    factory_slave: factory_slave,
};
