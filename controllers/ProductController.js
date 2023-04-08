const Product = require('../models/Product')
module.exports = {
    async insertProduct(req, res) {
        try {
            let resultado = req.body.price
            var price = resultado.toLocaleString('pt-br', {minimumFractionDigits: 2});

            const { name, description, weight, type } = req.body
            const product = await Product.findOne({ where: { name } })
            if (product) {
                res.status(401).json({ massage: "Produto já cadastrado!" })
            } else {
                const product = await Product.create({ name, description, price, weight, type })
                
                res.redirect('/products')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listProducts(req, res) {
        const products = await Product.findAll({ order: [['name', 'ASC']] })
        console.log(products)
        res.render('products/products', { products })
    },

    async createProduct(req, res) {
        res.render('products/createproduct')
    },

    async showProduct(req, res) {
        const { id } = req.params
        const product = await Product.findOne({ where: { id } })
        console.log(product)
        res.render('products/product', { product })
    },

    async removeProduct(req, res) {
        const { id } = req.params
        const product = await Product.findOne({ where: { id } })
        Product.destroy({ where: { id } })

        res.redirect('/products')
    },

    async editProduct(req, res) {
        const { id } = req.params
        const product = await Product.findOne({ where: { id } })
        console.log(product)
        res.render('products/editproduct', { product })
    },

    async updateProduct(req, res) {
        try {
            const id = req.body.id

            const { name, description, price, weight, type } = req.body
            let product = await Product.findOne({ where: { id } })

            if (!product) {
                res.status(401).json({ message: "Produto não encontrado!" })
            } else {
                const product = await Product.update({ name, description, price, weight, type }, { where: { id } })

                res.redirect('/products')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
}