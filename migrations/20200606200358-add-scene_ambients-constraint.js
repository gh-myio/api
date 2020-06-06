'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
          BEGIN TRANSACTION;

    ALTER TABLE scenes
DROP CONSTRAINT scenes_ambient_id_fkey,
 ADD CONSTRAINT scenes_ambient_id_fkey
    FOREIGN KEY (ambient_id)
     REFERENCES ambients(id)
      ON DELETE SET NULL;

         COMMIT;
    `

    return queryInterface.sequelize.query(query)
  },

  down: (queryInterface, Sequelize) => {
    const query = `
          BEGIN TRANSACTION;

    ALTER TABLE scenes
DROP CONSTRAINT scenes_ambient_id_fkey,
 ADD CONSTRAINT scenes_ambient_id_fkey
    FOREIGN KEY (ambient_id)
     REFERENCES ambients(id);

         COMMIT;
    `

    return queryInterface.sequelize.query(query)
  }
};
