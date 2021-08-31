module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
DELETE FROM
  "consumption_realtime"
WHERE
  "slave_id" NOT IN (
    SELECT
      "id"
    FROM
      "slaves"
  );
`)
  },

  down: (queryInterface, Sequelize) => {

  }
}
