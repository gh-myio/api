module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
UPDATE
  "public"."alert_history" a
SET
  channel_id = c.id
FROM
  "public"."channels" c
WHERE
  a.slave_id = c.slave_id
  AND a.channel_channel = c.channel;
`)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
UPDATE
  "public"."alert_history" a
SET
  channel_id = NULL;
`)
  }
}
