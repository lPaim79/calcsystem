const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const ProviderController = require('../controllers/ProviderController')

router.post('/providers/updateprovider', ProviderController.updateProvider)
router.get('/providers', ProviderController.listProviders)
router.get('/provider/:id', ProviderController.showProvider)
router.get('/createprovider', ProviderController.createProvider)
router.get('/providers/remove/:id', ProviderController.removeProvider)
router.get('/provideredit/:id', ProviderController.editProvider)
router.post('/insertprovider', ProviderController.insertProvider)

module.exports = router