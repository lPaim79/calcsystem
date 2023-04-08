const express = require('express')
const bodyparser = require('body-parser')
const router = express.Router()

const ProductController = require('../controllers/ProductController')

router.post('/products/updateproduct', ProductController.updateProduct)
router.get('/products', ProductController.listProducts)
router.get('/product/:id', ProductController.showProduct)
router.get('/createproduct', ProductController.createProduct)
router.get('/products/remove/:id', ProductController.removeProduct)
router.get('/productedit/:id', ProductController.editProduct)
router.post('/insertproduct', ProductController.insertProduct)

module.exports = router