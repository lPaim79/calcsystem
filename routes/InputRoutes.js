const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const InputController = require('../controllers/InputController')

router.post('/inputs/updateinput', InputController.updateInput)
router.get('/inputs', InputController.listInputs)
router.get('/input/:id', InputController.showInput)
router.get('/inputs/remove/:id', InputController.removeInput)
router.get('/inputedit/:id', InputController.editInput)

module.exports = router