'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        CREATE TABLE public.channel_pulse_log (
          "timestamp" timestamp(0) with time zone NOT NULL DEFAULT now(),
          "channel" INTEGER,
          "value" INTEGER
        );

        SELECT create_hypertable('channel_pulse_log', 'timestamp');
      COMMIT;
      `
    return queryInterface.sequelize.query(migrate)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('channel_pulse_log')
  }
}
