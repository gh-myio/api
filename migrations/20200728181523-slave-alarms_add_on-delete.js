'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = `
i          BEGIN TRANSACTION;

    ALTER TABLE consumption_alerts
DROP CONSTRAINT consumption_alerts_slave_id_fkey,
 ADD CONSTRAINT consumption_alerts_slave_id_fkey
    FOREIGN KEY (slave_id)
     REFERENCES slaves(id)
      ON DELETE SET NULL;

         COMMIT;
    `

    return queryInterface.sequelize.query(query)
  },

  down: (queryInterface, Sequelize) => {
    const query = `
i          BEGIN TRANSACTION;

    ALTER TABLE consumption_alerts
DROP CONSTRAINT consumption_alerts_slave_id_fkey,
 ADD CONSTRAINT consumption_alerts_slave_id_fkey
    FOREIGN KEY (slave_id)
     REFERENCES slaves(id);

         COMMIT;
    `

    return queryInterface.sequelize.query(query)
  }
}
