'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        ALTER TABLE public.channels DROP COLUMN scene_id;

        ALTER TABLE public.channels
         ADD COLUMN scene_up_id integer
         REFERENCES scenes(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE;

        ALTER TABLE public.channels
         ADD COLUMN scene_down_id integer
         REFERENCES scenes(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE;
      COMMIT;
    `

    return queryInterface.sequelize.query(migrate)
  },

  down: (queryInterface, Sequelize) => {
    const migrate = `
      BEGIN;
        ALTER TABLE public.channels DROP COLUMN scene_up_id;
        ALTER TABLE public.channels DROP COLUMN scene_down_id;

        ALTER TABLE public.channels
         ADD COLUMN scene_id integer
         REFERENCES scenes(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE;
      COMMIT;
    `

    return queryInterface.sequelize.query(migrate)
  }
}
