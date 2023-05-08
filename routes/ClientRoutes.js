const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const ClientController = require('../controllers/ClientController')

//clients
router.post('/clients/updateclient', ClientController.updateClient)
router.get('/', ClientController.clientHome)
router.post('/clients', ClientController.listClients)
router.get('/clients', ClientController.listClients)
router.get('/client/:id', ClientController.showClient)
router.get('/createclient', ClientController.createClient)
router.get('/clients/remove/:id', ClientController.removeClient)
router.get('/clientedit/:id', ClientController.editClient)
router.post('/insertclient', ClientController.insertClient)

module.exports = router