const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ws = require('./lib/WebSocketHandler')
const Scheduler = require('./scheduler')

Scheduler.setSocket(ws)
Scheduler.prepare()
// Scheduler.setupEnergy()

let server = express()

if (process.env.PRIVATE_KEY) {
  try {
    // let config = JSON.parse(fs.readFileSync(process.env.CONFIG_PATH, 'utf-8'))

    global.privKey = process.env.PRIVATE_KEY
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
} else {
  console.error('Fatal: Private key not defined in env.')
  process.exit(1)
}
server.use(cors())
server.options('*', cors())

server.use(bodyParser.json())
// server.use(compression())
server = require('./lib/routes')(server)

// Error handling middleware
server.use((err, req, res, next) => {
  console.log('Error handling..', err)
  const status = err.status || 500
  const message = err.err || 'There was an error processing the request'

  if (err && err.log) {
    console.log('Logging error')
    console.log(err.log)
  }

  res.status(status)
  res.send({
    status: status,
    message: message
  })
})

server.listen(8080, function () {
  console.log('%s listening at 8080', server.name)
})
