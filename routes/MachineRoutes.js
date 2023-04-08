const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const MachineController = require('../controllers/MachineController')

router.post('/machines/updatemachine', MachineController.updateMachine)
router.get('/machines', MachineController.listMachines)
router.get('/machine/:id', MachineController.showMachine)
router.get('/createmachine', MachineController.createMachine)
router.get('/machines/remove/:id', MachineController.removeMachine)
router.get('/machineedit/:id', MachineController.editMachine)
router.post('/insertmachine', MachineController.insertMachine)
router.get('/createmachineinput/:id', MachineController.createinput)
router.post('/savemachineinput', MachineController.savemachineinput)

module.exports = router