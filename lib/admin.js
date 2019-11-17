const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroSequelize = require('admin-bro-sequelizejs')
const models = require('./models')

AdminBro.registerAdapter(AdminBroSequelize)

const adminBro = new AdminBro({
  databases: [models],
  rootPath: '/admin'
})

const adminRoute = AdminBroExpress.buildRouter(adminBro)

module.exports = (application) => {
  application.use(adminBro.options.rootPath, adminRoute)
}
