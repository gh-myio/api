module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

        ALTER TABLE metadata RENAME TO metadata_old;

        CREATE TABLE public.metadata (
          "timestamp" timestamp(0) with time zone NOT NULL DEFAULT now(),
          "type" character varying(255),
          "action" character varying(255),
          "data" TEXT,
          "user" character varying(255)
        );

        SELECT create_hypertable('metadata', 'timestamp');

        INSERT INTO metadata SELECT "timestamp", "type", "action", "data", "user" FROM metadata_old;

        DROP TABLE metadata_old;

      COMMIT;
      `
    return queryInterface.sequelize.query(migrate)
  },

  down: (queryInterface, Sequelize) => {
    console.log('Failed. do nothing')
    return Promise.resolve()
  }
}
