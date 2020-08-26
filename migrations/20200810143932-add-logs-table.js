'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        CREATE TABLE public.logs (
          "timestamp" timestamp(0) with time zone NOT NULL DEFAULT now(),
          "type" character varying(255),
          "action_type" character varying(255),
          "user" character varying(255),
          "slave_id" integer,
          "ambient_id" integer,
          "scene_id" integer,
          "channel" integer,
          "rfir_command_id" integer,
          "value" integer
        );

        SELECT create_hypertable('logs', 'timestamp');

      COMMIT;
      `

    return queryInterface.sequelize.query(migrate)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('logs')
  }
}
