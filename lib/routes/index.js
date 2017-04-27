'use strict';

const ambients = require('./ambients');
const slaves = require('./slaves');
const scenes = require('./scenes');
const devices = require('./devices');
const buttons = require('./rfir_buttons');
const channels = require('./channels');

module.exports = (restify) => {
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
    restify.post('/channels', channels.create);
    restify.del('/channels/:id', channels.destroy);
    restify.get('/channels/:id', channels.findById);
    restify.put('/channels/:id', channels.update);

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
    restify.get('/ambients', ambients.findAll);

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
    restify.get('/ambients/:id', ambients.findById);

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
    restify.post('/ambients', ambients.create);

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
    restify.put('/ambients/:id', ambients.update);

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
    restify.del('/ambients/:id', ambients.destroy);

    // Slaves
    restify.post('/slaves', slaves.create);
    restify.get('/slaves', slaves.findAll);

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
    restify.get('/scenes', scenes.findAll);

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
    restify.get('/scenes/:id', scenes.findById);

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
    restify.post('/scenes', scenes.create);

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
    restify.put('/scenes/:id', scenes.update);

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
    restify.del('/scenes/:id', scenes.destroy);

    restify.get('/devices/:id/remotes', devices.findDevices);


    restify.del('/rfir_buttons/:id', buttons.destroy);

    return restify;
};

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
