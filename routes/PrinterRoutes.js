const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const PrinterController = require('../controllers/PrinterController')
const SpeedController = require('../controllers/SpeedController')

router.post('/printers/updateprinter', PrinterController.updatePrinter)
router.get('/printers', PrinterController.listPrinters)
router.get('/printer/:id', PrinterController.showPrinter)
router.get('/createprinter', PrinterController.createPrinter)
router.get('/printers/remove/:id', PrinterController.removePrinter)
router.get('/printeredit/:id', PrinterController.editPrinter)
router.post('/insertprinter', PrinterController.insertPrinter)
router.get('/createprinterinput/:id', PrinterController.createinput)
router.post('/saveprinterinput', PrinterController.saveprinterinput)
router.get('/registerspeed/:id', PrinterController.registerspeed)
router.post('/insertregisterspeed/:id', SpeedController.insertregisterspeed)

module.exports = router