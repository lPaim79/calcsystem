const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const OrderController = require('../controllers/OrderController')

//orders
router.post('/orders/updateorder', OrderController.updateOrder)
router.get('/orders', OrderController.listOrders)
router.get('/order/:id', OrderController.showOrder)
router.get('/createorder', OrderController.createOrder)
router.get('/orders/remove/:id', OrderController.removeOrder)
router.get('/orderedit/:id', OrderController.editOrder)
router.post('/insertorder', OrderController.insertOrder)
router.get('/alterdate/:id', OrderController.alterDate)
router.post('/updatedate/:id', OrderController.updateDate)

module.exports = router