'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        ALTER TABLE public.channel_pulse_log
         ADD COLUMN "reading" INTEGER;
      COMMIT;
    `

    return queryInterface.sequelize.query(migrate)
  },

  down: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        ALTER TABLE public.channel_pulse_log
        DROP COLUMN "reading";
      COMMIT;
    `

    return queryInterface.sequelize.query(migrate)
  }
}
