const models = require('../models').Models
const utils = require('../utils')

async function save (req, res, next) {
  try {
    // get user id from headers
    const token = req.headers['x-access-token']
    const userData = utils.getUserData(token)
    const userUUID = userData.user_id

    if (!userUUID) throw new Error('Invalid user.')

    const currentFavorites = await models.Favorites.findOne({
      where: {
        user: userUUID
      }
    })

    const favoriteDevices = req.body.devices || []
    const favoriteAmbients = req.body.ambients || []
    const favoriteConsumption = req.body.consumption || []
    const favoriteScenes = req.body.scenes || []

    if (currentFavorites) {
      currentFavorites.devices = favoriteDevices
      currentFavorites.ambients = favoriteAmbients
      currentFavorites.consumption = favoriteConsumption
      currentFavorites.scenes = favoriteScenes

      await currentFavorites.save()
    } else {
      await models.Favorites.create({
        user: userUUID,
        devices: favoriteDevices,
        ambients: favoriteAmbients,
        consumption: favoriteConsumption
      })
    }

    const updatedFavorites = await models.Favorites.findOne({
      where: {
        user: userUUID
      }
    })

    return res.send(updatedFavorites)
  } catch (e) {
    console.log('Erroed: ', e)

    return next({
      status: 500,
      message: 'Erroed saving favorites.'
    })
  }
}

async function get (req, res, next) {
  try {
    // get user id from headers
    const token = req.headers['x-access-token']
    const userData = utils.getUserData(token)
    const userUUID = userData.user_id

    if (!userUUID) throw new Error('Invalid user.')

    const favorites = await models.Favorites.findOne({
      where: {
        user: userUUID
      }
    })

    if (!favorites) {
      return res.send({
        id: 0,
        user: userUUID,
        ambients: [],
        devices: [],
        scenes: [],
        consumption: []
      })
    }

    return res.send(favorites)
  } catch (e) {
    console.log('Erroed: ', e)

    return next({
      status: 500,
      message: 'Erroed querying user favorites.'
    })
  }
}

module.exports = {
  save,
  get
}
