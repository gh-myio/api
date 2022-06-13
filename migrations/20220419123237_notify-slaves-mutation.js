module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
CREATE TRIGGER slaves_notify_mutation
AFTER INSERT OR UPDATE OR DELETE
ON "slaves"
FOR EACH ROW EXECUTE PROCEDURE notify_table_mutation();
`)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
DROP TRIGGER slaves_notify_mutation ON "slaves";
`)
  }
}
