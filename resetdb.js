const models = require('./lib/models')

models.sequelize.sync({
  force: true,
  logging: console.log
}).then(() => {
  console.log('done')
  process.exit(1)
})
