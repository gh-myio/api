const env = process.env

const db = {
  username: env.DB_USERNAME || 'hubot',
  password: env.DB_PASSWORD || 'hubot',
  database: env.DB_DATABASE || 'hubot',
  host: env.DB_HOST || 'localhost',
  port: env.DB_PORT || 5432,
  logging: console.log,
  dialect: env.DB_DIALECT || 'postgres',
  storage: env.DB_STORAGE || undefined
}

const ws = env.SOCKET_URL || 'ws://localhost:3000/websocket'

module.exports = {
  ...db,
  ws: ws
}
