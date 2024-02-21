module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
DELETE FROM
  "rfir_buttons"
WHERE
  "rfir_remote_id" IS NULL
  OR "rfir_command_id" IS NULL;
`)
  },

  down: (queryInterface, Sequelize) => {

  }
}
