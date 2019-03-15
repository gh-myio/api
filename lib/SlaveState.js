'use strict';

class SlaveState {
    constructor() {
        this.state = {};
    }

    addState(data) {
        this.state[`slave_${data.id}`] = data.status;
    }

    getSlaveState(slaveId) {
        let status = this.state[`slave_${slaveId}`]

        if (status) {
            return status;
        } else {
            return 'waiting';
        }
    }
};

module.exports = new SlaveState();
