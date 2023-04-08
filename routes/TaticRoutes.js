const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const TaticController = require('../controllers/TaticController')
const InputController = require('../controllers/InputController')

router.post('/updatetatic', TaticController.updateTatic)
router.get('/tatics', TaticController.listTatics)
router.get('/tatic/:id', TaticController.showTatic)
router.get('/createtatic', TaticController.createTatic)
router.get('/tatics/remove/:id', TaticController.removeTatic)
router.get('/taticedit/:id', TaticController.editTatic)
router.post('/inserttatic', TaticController.insertTatic)
router.get('/insertinput/:id', TaticController.insertinput)
router.post('/savetatictinput', InputController.insertTaticInput)
router.get('/createtaticmachine/:id', TaticController.createmachine)
router.post('/savemachinetatic', TaticController.savetaticmachine)

module.exports = router