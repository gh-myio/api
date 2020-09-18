const models = require('../models').Models
const sequelize = require('../models').sequelize
const _ = require('lodash')

async function activate (req, res, next) {
  const id = req.params.id
  const data = await models.Scenes.findOne({
    where: {
      id: id
    }
  })

  if (!data) {
    res.status(404)
    return res.send({
      message: 'Scene not found.'
    })
  }

  const payload = {
    type: 'scene',
    command: 'activate',
    id: id
  }

  require('../WebSocketHandler').send(JSON.stringify(payload))

  res.send({
    status: 'ok'
  })
}

function findAll (req, res, next) {
  models.Scenes.findAll()
    .then(scenes => {
      if (!scenes) {
        return res.send([])
      }

      const json = _.map(scenes, scene => {
        const s = scene.toJSON()
        if (typeof s.json === 'string') {
          s.json = JSON.parse(s.json)
        }

        return s
      })

      return res.send(json)
    })
}

function findById (req, res, next) {
  const id = req.params.id

  models.Scenes.findOne({
    where: {
      id: id
    }
  })
    .then(scene => {
      if (!scene) {
        return res.send({
          status: 404,
          message: 'Scene not found'
        })
      }

      return res.send(scene)
    })
}

function destroy (req, res, next) {
  const id = req.params.id

  models.Scenes.findOne({
    where: {
      id: id
    }
  })
    .then(scene => {
      if (!scene) {
        return res.send({
          status: 404,
          message: 'Scene not found'
        })
      }

      scene.destroy()
        .then(() => {
          require('../WebSocketHandler').send(JSON.stringify({
            type: 'admin',
            command: 'scenes_updated'
          }))
          return res.send({
            status: 200,
            message: 'Scene destroyed.'
          })
        })
    })
}

async function update (req, res, next) {
  const id = parseInt(req.params.id, 10)

  try {
    await sequelize.transaction(async (transaction) => {
      const scene = await models.Scenes.findOne({
        where: {
          id: id
        },
        transaction: transaction
      })

      if (!scene) {
        throw new Error('Scene not found')
      }

      const keys = _.keys(req.body)

      _.forEach(keys, key => {
        let data = req.body[key]
        if (key === 'json' && typeof data === 'object') {
          data = JSON.stringify(data)
        }

        scene.set(key, data)
      })

      await scene.save({
        transaction: transaction
      })

      await scene.reload({
        transaction: transaction
      })

      return res.send(scene)
    })

    require('../WebSocketHandler').send(JSON.stringify({
      type: 'admin',
      command: 'scenes_updated'
    }))
  } catch (err) {
    return res.send({
      status: 500,
      message: 'Error updating the scene.',
      err: err.message
    })
  }
}

async function create (req, res, next) {
  req.body.json = req.body.json ? JSON.stringify(req.body.json) : req.body.json

  console.log(req.body)

  try {
    await sequelize.transaction(async (transaction) => {
      const scene = models.Scenes.create(req.body, {
        transaction: transaction
      })

      if (!scene) {
        throw new Error('Unable to create the Scene')
      }

      const json = scene.toJSON()

      if (typeof json.json === 'string') {
        json.json = JSON.parse(json.json)
      }

      return res.send(scene)
    })

    require('../WebSocketHandler').send(JSON.stringify({
      type: 'admin',
      command: 'scenes_updated'
    }))
  } catch (err) {
    res.send({
      status: 500,
      message: 'Error creating the scene',
      err: err.message
    })
  }
}

module.exports = {
  findAll: findAll,
  findById: findById,
  create: create,
  update: update,
  activate: activate,
  destroy: destroy
}
