const _ = require('lodash')
const Environment = require('../models').Models.Environment

const reduceModels = (models) => _.reduce(models, (acc, row) => ({ ...acc, [row.key]: row.value }), {})

const find = async ({ params: { key } }, res, next) => (
  Environment.findAll({ where: key ? { key } : {} })
    .then(reduceModels)
    .then((data) => res.send(data))
)

const destroy = async ({ params: { key } }, res, next) => {
  const row = await Environment.findOne({ where: { key } })
  if (!row) {
    return res.status(404).send()
  }
  return row.destroy()
    .then(() => res.status(204).send())
}

const put = async ({ body, params: { key } }, res, next) => {
  if (typeof body !== 'string') {
    return res.status(400).send()
  }
  const value = body
  const row = await Environment.findOne({ where: { key } })
  if (!row) {
    return Environment.create({ key, value })
      .then(() => res.status(201).send())
  }
  row.value = value
  return row.save()
    .then(() => res.status(204).send())
}

module.exports = {
  find,
  put,
  destroy
}
