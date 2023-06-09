const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const BudgetController = require('../controllers/BudgetController')
const ClientController = require('../controllers/ClientController')
const MaterialController = require('../controllers/MaterialController')
const TaticController = require('../controllers/TaticController')

//budgets
router.post('/updatebudget', BudgetController.updateBudget)
router.get('/budgets', BudgetController.listBudgets)
router.post('/budgets', BudgetController.listBudgets)
router.get('/budget/:id', BudgetController.showBudget)
router.get('/createbudget', BudgetController.createbudget)
router.get('/budgets/remove/:id', BudgetController.removeBudget)
router.get('/budgetedit/:id', BudgetController.editBudget)
router.post('/insertbudget', BudgetController.insertBudget)
router.get('/showBudgetsClient/:id', BudgetController.showBudgetsClient)
router.get('/createbudgettatics/:id', BudgetController.createtatic)
router.post('/selectbudgettatict/:id', BudgetController.selectbudgettatic)
router.post('/savebudgettatict/:id', BudgetController.savebudgettatic)
router.get('/selectprinter/:id', BudgetController.selectprinter)
router.post('/createprint/:id', BudgetController.createprint)
router.post('/savebudgetprint/:id', BudgetController.savebudgetprint)
router.get('/creatematerial/:id', BudgetController.creatematerial)
router.post('/selectbudgetmaterial/:id', BudgetController.selectbudgetmaterial)
router.post('/savebudgetmaterial/:id', BudgetController.savebudgetmaterial)
router.get('/deletematerial/:id', BudgetController.removematerial)
router.get('/deleteprint/:id', BudgetController.removeprint)
router.get('/deletetatic/:id', BudgetController.removetatic)
router.get('/calculate/:id', BudgetController.calculate)
router.get('/budgets/approved/:id', BudgetController.appoved)
router.get('/budgets/clone/:id', BudgetController.clonebudget)
router.get('/budgettaticedit/:id', BudgetController.budgettaticedit)
router.post('/updatetatict/:id', BudgetController.updatetatic)
router.get('/editprint/:id', BudgetController.editprint)
router.post('/updatebudgetprint', BudgetController.updatebudgetprint)
router.get('/createcliente/', ClientController.createClient)
router.get('/materialedit/:id', MaterialController.editMaterial)
router.get('/material/:id', MaterialController.showMaterial)
router.post('/updatbudgetematerial/:id', BudgetController.updatbudgetematerial)
router.get('/tatic/:id', TaticController.showTatic)
router.get('/alterbudgetdate/:id', BudgetController.alterDate)
router.post('/updatebudgetdate/:id', BudgetController.updateDate)

module.exports = router