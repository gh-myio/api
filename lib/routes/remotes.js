const models = require('../models').Models

function findAll (req, res, next) {
  models.RfirRemotes.findAll({
    include: [
      models.Rfir
    ]
  })
    .then(remotes => {
      if (!remotes) {
        return res.send([])
      }

      return res.send(remotes)
    })
}

// function setRemoteCommand (req, res, next) {
//   const id = req.params.id
//
//   models.RfirRemotes.findOne({
//     where: {
//       id: id
//     }
//   })
//     .then(remote => {
//       if (!remote) {
//         return next({
//           status: 404,
//           message: 'Remote not found'
//         })
//       }
//
//       return res.send(remote)
//     })
//     .catch((err) => {
//       return next({
//         status: 500,
//         err: err
//       })
//     })
// }

function findById (req, res, next) {
  const id = req.params.id

  models.RfirRemotes.findOne({
    where: {
      id: id
    }
  })
    .then(remote => {
      if (!remote) {
        return res.send({
          status: 404,
          message: 'Remote not found'
        })
      }

      return res.send(remote)
    })
}

module.exports = {
  findAll: findAll,
  findById: findById
}
