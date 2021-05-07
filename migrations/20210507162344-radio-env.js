const Sequelize = require('sequelize')
const Op = Sequelize.Op
const _ = require('lodash')

const variables = [
  'CENTRAL_ID',
  'FREQUENCY'
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    const rows = _.map(variables, (key) => ({ key, value: process.env[key] }))
    return queryInterface.bulkInsert('environment', rows, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('environment', { key: { [Op.in]: variables } }, {})
  }
}
