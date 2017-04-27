'use strict';

const _ = require('lodash');

class InfraredState {
    constructor() {
        this.state = {};
    }

    addState(data) {
        this.state[`slave_${data.id}`] = data;
    }

    getSlaveTemperature(slaveId) {
        let ir = this.state[`slave_${slaveId}`];

        if (ir.temperature) {
            return ir.temperature;
        } else {
            return -1;
        }
    }

    getSlaveBattery(slaveId) {
        let ir = this.state[`slave_${slaveId}`];

        if (ir.battery) {
            return ir.battery;
        } else {
            return -1;
        }
    }
};

module.exports = new InfraredState();
