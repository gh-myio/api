const ambients = require('./ambients')
const slaves = require('./slaves')
const scenes = require('./scenes')
const schedules = require('./schedule')
const devices = require('./devices')
const buttons = require('./rfir_buttons')
const channels = require('./channels')
const ambientPermissions = require('./ambient_permissions')
const consumption = require('./consumption')
const auth = require('./auth')
const alarms = require('./alarms')
const alerts = require('./consumption_alerts')
const alertsHistory = require('./alert_history')
const metadata = require('./metadata')
const flow = require('./flow')
const acl = require('./acl')
const temperatureHistory = require('./temperature_history')

// v2
const slavesv2 = require('./v2/slaves')
const devicesv2 = require('./v2/devices')

module.exports = (express) => {
  // ACL

  express.get('/acl/local_token', acl.getLocalToken)
  express.get('/acl/login', acl.login)
  express.post('/acl/auth', acl.auth)

  // METADATA
  express.get('/metadata/:type/:page', metadata.findAll)

  // PERMISSIONS
  express.get('/ambient_permissions', ambientPermissions.findAll)
  express.get('/ambient_permissions/user/:userId', ambientPermissions.getUserAmbients)
  express.post('/ambient_permissions', ambientPermissions.create)

  /**
     * @swagger
     * resourcePath: /api
     * description: All about API
     */

  /**
     * @swagger
     * path: /channels
     * operations:
     * TODO
     */
  express.post('/channels', channels.create)
  express.delete('/channels/:id', channels.destroy)
  express.get('/channels/:id', channels.findById)
  express.put('/channels/:id', channels.update)

  /**
     * @swagger
     * path: /ambients
     * operations:
     *   -  httpMethod: GET
     *      summary: Querys all ambients on database
     *      notes: Returns an JSON Array with Ambients
     *      responseClass: Ambient
     *      nickname: ambient_list
     *      consumes:
     *        - application/json
     */
  express.get('/ambients', ambients.findAll)
  express.put('/ambients/order', ambients.updateAmbientsOrder)

  /**
     * @swagger
     * path: /ambients/{id}
     * operations:
     *   -  httpMethod: GET
     *      summary: Query an Ambient by it's id
     *      notes: Returns an error or status OK
     *      responseClass: Ambient
     *      nickname: ambient_delete
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: id
     *          in: path
     *          description: Ambient's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     */
  express.get('/ambients/:id', ambients.findById)

  /**
     * @swagger
     * path: /ambients
     * operations:
     *   -  httpMethod: POST
     *      summary: Querys all ambients on database
     *      notes: Returns an JSON Array with Ambients
     *      responseClass: Ambient
     *      nickname: ambient_create
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: body
     *          description: Ambient body
     *          paramType: body
     *          in: body
     *          required: true
     *          dataType: string
     *          schema:
     *              '$ref': '#/definitions/Ambient'
     */
  express.post('/ambients', ambients.create)

  /**
     * @swagger
     * path: /ambients/{id}
     * operations:
     *   -  httpMethod: PUT
     *      summary: Querys all ambients on database
     *      notes: Returns an JSON Array with Ambients
     *      responseClass: Ambient
     *      nickname: ambient_create
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: body
     *          description: Ambient body
     *          paramType: body
     *          in: body
     *          required: true
     *          dataType: string
     *          schema:
     *              '$ref': '#/definitions/Ambient'
     *        - name: id
     *          in: path
     *          description: Ambient's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     */
  express.put('/ambients/:id', ambients.update)

  /**
     * @swagger
     * path: /ambients/{id}
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete an Ambient by it's id
     *      notes: Returns an error or status OK
     *      responseClass: Ambient
     *      nickname: ambient_delete
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: id
     *          in: path
     *          description: Ambient's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     */
  express.delete('/ambients/:id', ambients.destroy)

  // Slaves
  express.post('/slaves', slaves.create)
  express.get('/slaves', slaves.findAll)
  express.get('/v2/slaves', slavesv2.findAll)
  // express.get('/slaves_ghome', slaves.findAllGhome);
  express.get('/slaves/:id', slaves.find)
  express.post('/slaves/:id/action', slaves.execute)
  express.delete('/slaves/:id', slaves.destroy)
  express.put('/slaves/:id', slaves.update)

  // Schedules
  express.get('/schedules', schedules.findAll)
  express.get('/schedules/:id', schedules.findById)
  express.post('/schedules', schedules.create)
  express.put('/schedules/:id', schedules.update)
  express.delete('/schedules/:id', schedules.destroy)

  // SCENES

  /**
     * @swagger
     * path: /scenes
     * operations:
     *   -  httpMethod: GET
     *      summary: Querys all scenes on database
     *      notes: Returns an JSON Array with Scenes
     *      responseClass: Scene
     *      nickname: scenes_list
     *      consumes:
     *        - application/json
     */
  express.get('/scenes', scenes.findAll)

  /**
     * @swagger
     * path: /scenes/{id}
     * operations:
     *   -  httpMethod: GET
     *      summary: Query an Scene by it's id
     *      notes: Returns an error or status OK
     *      responseClass: Scene
     *      nickname: scenes_delete
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: id
     *          in: path
     *          description: Scene's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     */
  express.get('/scenes/:id', scenes.findById)

  /**
     * @swagger
     * path: /scenes
     * operations:
     *   -  httpMethod: POST
     *      summary: Querys all scenes on database
     *      notes: Returns an JSON Array with Scenes
     *      responseClass: Scene
     *      nickname: scenes_create
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: body
     *          description: Scene body
     *          paramType: body
     *          in: body
     *          required: true
     *          dataType: string
     *          schema:
     *              '$ref': '#/definitions/Scene'
     */
  express.post('/scenes', scenes.create)

  /**
     * @swagger
     * path: /ambients/{id}
     * operations:
     *   -  httpMethod: PUT
     *      summary: Querys all scenes on database
     *      notes: Returns an JSON Array with Scenes
     *      responseClass: Scene
     *      nickname: scenes_create
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: body
     *          description: Scene's body
     *          paramType: body
     *          in: body
     *          required: true
     *          dataType: string
     *          schema:
     *              '$ref': '#/definitions/Scene'
     *        - name: id
     *          in: path
     *          description: Scene's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     */
  express.put('/scenes/:id', scenes.update)

  /**
     * @swagger
     * path: /scenes/{id}
     * operations:
     *   -  httpMethod: DELETE
     *      summary: Delete an Scene by it's id
     *      notes: Returns an error or status OK
     *      responseClass: Ambient
     *      nickname: scenes_delete
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: id
     *          in: path
     *          description: Scene's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     */
  express.delete('/scenes/:id', scenes.destroy)

  express.get('/v2/devices/:id/remotes', devicesv2.findDevices)
  express.get('/devices/:id/remotes', devices.findDevices)
  express.delete('/devices/:id', devices.destroy)
  express.post('/devices', devices.create)
  express.put('/devices/:id', devices.update)

  express.post('/rfir_buttons', buttons.create)
  express.put('/rfir_buttons/order', buttons.updateButtonOrder)
  express.put('/rfir_buttons/:id', buttons.update)
  express.delete('/rfir_buttons/:id', buttons.destroy)

  express.get('/temperature_history/slave/:slaveId/:start/:end', temperatureHistory.query)

  /**
     * @swagger
     * path: /consumption/slave/{slaveId}/{type}/{start}/{end}
     * operations:
     *   -  httpMethod: GET
     *      summary: Query slave consumption data
     *      notes: Returns an error or status OK
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: slaveId
     *          in: path
     *          description: slave's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     *        - name: type
     *          in: path
     *          description: type of data to return (minute | hour | day | month | year)
     *          paramType: path
     *          required: true
     *          dataType: string
     *        - name: start
     *          in: path
     *          description: start datetime for query, including
     *          paramType: path
     *          required: true
     *          dataType: dateTime
     *        - name: end
     *          in: path
     *          description: end datetime for query, excluding
     *          paramType: path
     *          required: true
     *          dataType: dateTime
     */
  express.get('/consumption/slave/:slaveId/:type/:start/:end', consumption.findSlave)

  /**
     * @swagger
     * path: /consumption/ambient/{ambientId}/{type}/{start}/{end}
     * operations:
     *   -  httpMethod: GET
     *      summary: Query ambient consumption data
     *      notes: Returns an error or status OK
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: ambientId
     *          in: path
     *          description: ambient's id
     *          paramType: path
     *          required: true
     *          dataType: integer
     *        - name: type
     *          in: path
     *          description: type of data to return (minute | hour | day | month | year)
     *          paramType: path
     *          required: true
     *          dataType: string
     *        - name: start
     *          in: path
     *          description: start datetime for query, including
     *          paramType: path
     *          required: true
     *          dataType: dateTime
     *        - name: end
     *          in: path
     *          description: end datetime for query, excluding
     *          paramType: path
     *          required: true
     *          dataType: dateTime
     */
  express.get('/consumption/ambient/:ambientId/:type/:start/:end', consumption.findAmbient)

  /**
     * @swagger
     * path: /consumption/all/{type}/{start}/{end}
     * operations:
     *   -  httpMethod: GET
     *      summary: Query slave consumption data
     *      notes: Returns an error or status OK
     *      consumes:
     *        - application/json
     *      parameters:
     *        - name: type
     *          in: path
     *          description: type of data to return (minute | hour | day | month | year)
     *          paramType: path
     *          required: true
     *          dataType: string
     *        - name: start
     *          in: path
     *          description: start datetime for query, including
     *          paramType: path
     *          required: true
     *          dataType: dateTime
     *        - name: end
     *          in: path
     *          description: end datetime for query, excluding
     *          paramType: path
     *          required: true
     *          dataType: dateTime
     */
  express.get('/consumption/all/:type/:start/:end', consumption.findAll)

  express.get('/auth/register', auth.register)

  express.post('/auth/factory_slave', auth.factorySlave)

  express.get('/alarms', alarms.findAll)

  /*
     * Consumption alerts
     */
  express.get('/alerts/', alerts.findAll)
  express.post('/alerts/', alerts.create)
  express.put('/alerts/:id', alerts.update)
  express.delete('/alerts/:id', alerts.destroy)

  // express.get('/alerts/:type', alerts.findAll)
  // express.get('/alerts/:type/:slaveId', alerts.findBySlaveId)
  // express.post('/alerts/:type/:slaveId', alerts.update)

  /* Alert history */

  express.get('/alerts/status/:status', alertsHistory.findByStatus)
  express.get('/alerts_history', alertsHistory.findAll)

  express.get('/flow/slave/:slaveId/:channel/:start/:end', flow.findByChannel)

  return express
}

/**
 * @swagger
 * models:
 *   Ambient:
 *     id: Ambient
 *     properties:
 *       name:
 *         type: String
 *       image:
 *         type: String
 */
