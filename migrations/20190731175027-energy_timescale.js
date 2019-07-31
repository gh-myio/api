'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let migrate = `
        BEGIN;
            ALTER TABLE consumption_realtime DROP column id;
            SELECT create_hypertable('consumption_realtime', 'timestamp');
        COMMIT;
        `
        return queryInterface.sequelize.query(migrate);
    },

    down: (queryInterface, Sequelize) => {
        console.log('Failed. do nothing')
        return Promise.resolve()
    }
};
