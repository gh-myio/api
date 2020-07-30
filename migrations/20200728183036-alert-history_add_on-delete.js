'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
          BEGIN TRANSACTION;

    ALTER TABLE alert_history
DROP CONSTRAINT alert_history_slave_id_fkey,
 ADD CONSTRAINT alert_history_slave_id_fkey
    FOREIGN KEY (slave_id)
     REFERENCES slaves(id)
      ON DELETE SET NULL;

         COMMIT;
    `

    return queryInterface.sequelize.query(query)
  },

  down: (queryInterface, Sequelize) => {
    const query = `
          BEGIN TRANSACTION;

    ALTER TABLE alert_history
DROP CONSTRAINT alert_history_slave_id_fkey,
 ADD CONSTRAINT alert_history_slave_id_fkey
    FOREIGN KEY (slave_id)
     REFERENCES slaves(id)

         COMMIT;
    `

    return queryInterface.sequelize.query(query)
  }
}
