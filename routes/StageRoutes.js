const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const StageController = require('../controllers/StageController')

router.post('/stages/updatestage', StageController.updateStage)
router.get('/stages', StageController.listStages)
router.get('/stage/:id', StageController.showStage)
router.get('/createstage', StageController.createStage)
router.get('/stages/remove/:id', StageController.removeStage)
router.get('/stageedit/:id', StageController.editStage)
router.post('/insertstage', StageController.insertStage)

module.exports = router