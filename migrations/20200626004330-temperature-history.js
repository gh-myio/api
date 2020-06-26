'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
      BEGIN;
        CREATE TABLE public.temperature_history (
          "timestamp" timestamp(0) with time zone NOT NULL DEFAULT now(),
          "value" DECIMAL,
          "slave_id" integer REFERENCES slaves(id) ON DELETE SET NULL ON UPDATE CASCADE
        );

        SELECT create_hypertable('temperature_history', 'timestamp');

      COMMIT;
    `

    return queryInterface.sequelize.query(query)
  },

  down: (queryInterface, Sequelize) => {
    const query = `
      DROP TABLE public.temperature_history;
    `

    return queryInterface.sequelize.query(query)
  }
}
