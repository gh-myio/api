module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
CREATE FUNCTION notify_table_mutation()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'table_mutation',
    json_build_object(
      'op', TG_OP,
      'new', row_to_json(NEW),
      'old', row_to_json(OLD),
      'table', TG_TABLE_NAME
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER environment_notify_mutation
AFTER INSERT OR UPDATE OR DELETE
ON "environment"
FOR EACH ROW EXECUTE PROCEDURE notify_table_mutation();
`)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
DROP FUNCTION notify_table_mutation();
DROP TRIGGER environment_notify_mutation ON "environment";
`)
  }
}
