module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
UPDATE
  "public"."consumption_alerts" a
SET
  channel_id = c.id
FROM
  "public"."channels" c
WHERE
  a.slave_id = c.slave_id
  AND (a.extra::jsonb->>'channel')::int = c.channel;
`)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
UPDATE
  "public"."consumption_alerts" a
SET
  channel_id = NULL;
`)
  }
}
