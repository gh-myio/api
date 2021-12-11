const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy

const cors = require('cors')
const ws = require('./lib/WebSocketHandler')
const Scheduler = require('./scheduler')
const http = require('http')
const path = require('path')
const models = require('./lib/models').Models

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
global.centralSerial = process.env.CENTRAL_SERIAL
global.cloudUrl = process.env.CLOUD_URL || 'https://server.myio.com.br'

Scheduler.setSocket(ws)
Scheduler.prepare()

let app = express()

function ExtractJwt (req) {
  if (req.query.jwt) {
    return req.query.jwt
  }
  return req.headers['x-access-token']
}
const jwtOptions = {
  jwtFromRequest: ExtractJwt,
  secretOrKey: global.privKey
}
var strategy = new JwtStrategy(jwtOptions, function (jwtPayload, next) {
  const user = {
    id: jwtPayload.user_id,
    role: jwtPayload.role
  }
  next(null, user)
})
passport.use(strategy)
app.use(passport.initialize())

app.set('etag', false)

app.use(cors())
app.options('*', cors())

app.use(cookieParser())

const parseJSON = bodyParser.json({ limit: '50mb' })
const parseText = bodyParser.text()
app.use((req, res, next) => req.headers['content-type'] === 'text/plain' ? parseText(req, res, next) : parseJSON(req, res, next))

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

const server = http.createServer(app)

server.listen(8080)

models.Environment.findOne({ where: { key: 'NODERED_ENABLED' } }).then(row => {
  if (row && row.value && (row.value === 'false' || row.value === '0' || row.value === 'no')) {
    return
  }

  const RED = require('node-red')
  models.User.scope('login').findAll()
    .then((users) => {
      const _users = users.map((user) => {
        return {
          username: user.email,
          password: user.password,
          permissions: '*'
        }
      })

      const settings = {
        httpAdminRoot: '/red',
        httpNodeRoot: '/api',
        userDir: path.join(__dirname, '/nodered_data/'),
        nodesDir: path.join(__dirname, '/nodered_nodes/'),
        functionGlobalContext: {},
        adminAuth: {
          type: 'credentials',
          users: _users,
          tokens: (token) => new Promise((resolve, reject) => {
            try {
              const { role, user_id: username } = jwt.verify(token, global.privKey)
              const permissions = role === 'admin' ? '*' : 'read'
              const user = { username, permissions }
              resolve(user)
            } catch (err) {
              resolve(null)
            }
          })
        },
        editorTheme: {
          header: {
            title: 'Myio',
            image: path.join(__dirname, '/misc/myio-logo-1024.png')
          },
          page: {
            css: path.join(__dirname, '/node_modules/@node-red-contrib-themes/midnight-red/theme.css')
          }
        }
      }

      RED.init(server, settings)

      app.use(settings.httpAdminRoot, RED.httpAdmin)
      app.use(settings.httpNodeRoot, RED.httpNode)

      RED.start()
    })
})
