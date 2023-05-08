const Order = require('../models/Order')
const Client = require('../models/Client')
const Product = require('../models/Product')
const Stage = require('../models/Stage')

module.exports = {
    async insertOrder(req, res) {
        try {
            const { date, description, payment, prevision, client_id, product_id, stage_id } = req.body
            const price = req.bod.price.replace(",",".")
            const order = await Order.create({ date, description, price, payment, prevision, client_id, product_id, stage_id })
            console.log(order)
            res.redirect('/orders')
        }
        catch (error) {
            res.status(400).json({ error })
        }
    },

    async listOrders(req, res) {
        const orders = await Order.findAll({
            include: [
                {
                    association: 'client',
                    attributes: [ 'id' , 'name', 'fantasy' ],
                    required: false
                },
                {
                    association: 'stage',
                    attributes: [ 'id' , 'name' ],
                    required: false
                },       
                {
                    association: 'product',
                    attributes: [ 'id' , 'name' ],
                    required: false
                }
                  
            ], order: [['date', 'DESC']]
        });
        res.render('orders/orders', { orders })
    },

    async createOrder(req, res) {
        const clients = await Client.findAll()
        const products = await Product.findAll()
        const stages = await Stage.findAll()
        res.render('orders/createorder', { clients, products, stages })
    },

    async showOrder(req, res) {
        const { id } = req.params
        const order = await Order.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: ['name', 'fantasy'],
                    required: false
                },
                {
                    association: 'stage',
                    attributes: ['name'],
                    required: false
                },       
                {
                    association: 'product',
                    attributes: ['name'],
                    required: false
                }
                  
            ],
        })
        res.render('orders/order', { order })
    },

    async removeOrder(req, res) {
        const { id } = req.params
        const order = await Order.findOne({ where: { id } })
        await Order.destroy({ where: { id } })

        res.redirect('/orders')
    },

    async editOrder(req, res) {
        const { id } = req.params
        const clients = await Client.findAll()
        const products = await Product.findAll()
        const stages = await Stage.findAll()
        const order = await Order.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: [ 'id' , 'name', 'fantasy' ],
                    required: false
                },
                {
                    association: 'stage',
                    attributes: [ 'id' , 'name' ],
                    required: false
                },       
                {
                    association: 'product',
                    attributes: [ 'id' , 'name' ],
                    required: false
                }
                  
            ],
        })
        res.render('orders/editorder', { order, clients, products, stages })
    },

    async updateOrder(req, res) {
        try {
            const id = req.body.id
            const {date, description, payment, prevision, client_id, product_id, stage_id } = req.body
            const price = req.body.price.replace(",",".")
            const order = await Order.update({ date, description, price, payment, prevision, client_id, product_id, stage_id }, { where: {id} })
           
            res.redirect('/orders')
        }
        catch (error) {
            res.status(400).json({ error })
        }
    },

    async alterDate(req, res) {
        const id = req.params
        const order = Order.findOne({
            where: {id}
        })
        console.log('Alterar Data')
        res.render('orders/alterdate',{order})
    },

    async updateDate(req, res) {
        const id = req.body.id
        const {date, description, price, payment, prevision, client_id, product_id, stage_id } = req.body
        const order = await Order.update({ date, description, price, payment, prevision, client_id, product_id, stage_id }, { where: {id} })
        res.redirect('/orders')
    }
   
}