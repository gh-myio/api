module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
DELETE FROM
  "ambient_permissions"
WHERE
  "ambient_id" IS NULL;
`)
  },

  down: (queryInterface, Sequelize) => {

  }
}
