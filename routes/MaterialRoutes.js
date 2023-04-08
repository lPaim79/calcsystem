const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const MaterialController = require('../controllers/MaterialController')

//materials
router.post('/materials/updatematerial', MaterialController.updateMaterial)
router.get('/materials', MaterialController.listMaterials)
router.get('/material/:id', MaterialController.showMaterial)
router.get('/creatematerial', MaterialController.createMaterial)
router.get('/materials/remove/:id', MaterialController.removeMaterial)
router.get('/materialedit/:id', MaterialController.editMaterial)
router.post('/insertmaterial', MaterialController.insertMaterial)

module.exports = router