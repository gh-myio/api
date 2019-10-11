const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ws = require('./lib/WebSocketHandler')
const Scheduler = require('./scheduler')
const RED = require('node-red')
const http = require('http')
const path = require('path')

Scheduler.setSocket(ws)
Scheduler.prepare()

let app = express()

if (process.env.PRIVATE_KEY && process.env.CENTRAL_UUID) {
  try {
    global.privKey = process.env.PRIVATE_KEY
    global.centralUUID = process.env.CENTRAL_UUID
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
} else {
  console.error('Fatal: Private key or UUID not defined in env.')
  process.exit(1)
}

app.use(cors())
app.options('*', cors())

app.use(bodyParser.json())
app = require('./lib/routes')(app)

// Error handling middleware
app.use((err, req, res, next) => {
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

const settings = {
  httpAdminRoot: '/red',
  httpNodeRoot: '/api',
  userDir: path.join(__dirname, '/nodered_data/'),
  nodesDir: path.join(__dirname, '/nodered_nodes/'),
  functionGlobalContext: {}
}

const server = http.createServer(app)

RED.init(server, settings)

app.use(settings.httpAdminRoot, RED.httpAdmin)
app.use(settings.httpNodeRoot, RED.httpNode)

server.listen(8080)

RED.start()
