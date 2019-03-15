'use strict';

const _ = require('lodash');

class SlaveState {
    constructor() {
        this.state = {};
    }

    addState(data) {
        this.state[`slave_${data.id}`] = data.status;
    }

    getSlaveState(slaveId) {
        let slave = this.state[`slave_${slaveId}`]

        if (slave) {
            return slave.status;
        } else {
            return 'waiting';
        }
    }
};

module.exports = new SlaveState();
