const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const PaperController = require('../controllers/PaperController')

router.post('/papers/updatepaper', PaperController.updatePaper)
router.get('/papers', PaperController.listPapers)
router.get('/paper/:id', PaperController.showPaper)
router.get('/createpaper', PaperController.createPaper)
router.get('/papers/remove/:id', PaperController.removePaper)
router.get('/paperedit/:id', PaperController.editPaper)
router.post('/insertpaper', PaperController.insertPaper)

module.exports = router