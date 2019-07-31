'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.sequelize.connectionManager.config.database = process.env.DB_DATABASE
        queryInterface.sequelize.connectionManager.config.username = 'root'
        queryInterface.sequelize.connectionManager.config.password = process.env.DB_PASSWORD
        queryInterface.sequelize.connectionManager.config.host = process.env.HOST
        queryInterface.sequelize.connectionManager.pool.clear()

        let migrate = `
        BEGIN;
            ALTER TABLE consumption_realtime RENAME TO consumption_realtime_old;

            CREATE TABLE public.consumption_realtime (
                "timestamp" timestamp(0) with time zone NOT NULL DEFAULT now(),
                slave_id integer NOT NULL,
                ambient_id integer[],
                value real NOT NULL
            );

            SELECT create_hypertable('consumption_realtime', 'timestamp');

            INSERT INTO consumption_realtime SELECT timestamp, slave_id, ambient_id, value FROM consumption_realtime_old;

        COMMIT;
        `
        return queryInterface.sequelize.query(migrate);
    },

    down: (queryInterface, Sequelize) => {
        console.log('Failed. do nothing')
        return Promise.resolve()
    }
};
