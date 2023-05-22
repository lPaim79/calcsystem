const Address = require('../models/Address')
const Client = require('../models/Client')
const Order = require('../models/Order')
const Budget = require('../models/Budget')
const func = require('../helpers/functions')
const { Op } = require('sequelize')

module.exports = {
    async insertClient(req, res) {
        try {
            const { typeclient, email, cpf, phone, whatsapp, number, code, obs } = req.body
            const name = req.body.name.toUpperCase()
            const fantasy = req.body.fantasy.toUpperCase()
            const street = req.body.street.toUpperCase()
            const complement = req.body.complement.toUpperCase()
            const district = req.body.district.toUpperCase()
            const city = req.body.city.toUpperCase()

            if (!name) {
                res.status(401).json({ massage: "Nome obrigatório!" })
            } else {
                if (email) {
                    const client = await Client.findOne({ where: { email } })
                    if (client) {
                        res.status(401).json({ massage: "Email já cadastrado!" })
                        return
                    }
                }
                if (phone) {
                    const client = await Client.findOne({ where: { phone } })
                    if (client) {
                        res.status(401).json({ massage: "Telefone já cadastrado!" })
                        return
                    }
                }
                const client = await Client.create({ name, typeclient, fantasy, email, cpf, phone, whatsapp, obs })
                const client_id = client.id
                const address = await Address.create({ street, number, complement, district, city, code, client_id })
                res.redirect('/clients')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listClients(req, res) {

        let search = ''
        let clients = ''
        if (req.body.search) {
            search = req.body.search

            let order = 'ASC'

            const clientsData = await Client.findAll({
                include: { association: 'addresses' },
                where: {
                    [Op.or]: {
                        name: { [Op.like]: `%${search}%` },
                        fantasy: {[Op.like]: `%${search}%`}
                    }
                    
                },
                order: [['name', order]]
            })

            clients = clientsData.map((result) => result.get({ plain: true }))
            let clientsQty = clients.length

            if (clientsQty === 0) {
                clientsQty = false
            }
            console.log(clients)
            res.render('clients/clients', { clients, clientsQty, search })
        }
        else {
            const { page = 1 } = req.query
            const limit = 20;
            var lastPage = 1;
            const countClients = await Client.count();
            lastPage = Math.ceil(countClients / limit)
            clients = await Client.findAll({
                include: { association: 'addresses' },
                order: [['name', 'ASC']],
                offset: Number((page * limit) - limit),
                limit: limit
            });
            if (clients) {
                var pagination = {
                    path: '/clients',
                    page,
                    prev_page_url: Number(page) - Number(1) >= 1 ? Number(page) - Number(1) : false,
                    next_page_url: Number(page) + Number(1) <= lastPage ? Number(page) + Number(1) : false,
                    //next_page_url: Number(page) + Number(1) >= lastPage ? lastPage : Number(page) + Number(1),
                    lastPage,
                    total: countClients,
                }
            }
            res.render('clients/clients', { clients, pagination })
        }        
    },

    async clientHome(req, res) {
        res.render('home')
    },

    async createClient(req, res) {
        res.render('clients/createclient')
    },

    async showClient(req, res) {
        const { id } = req.params
        const client = await Client.findOne({ where: { id }, include: { association: 'addresses' } })


        const orders = await Order.findAll(
            {
                include: [
                    {
                        association: 'client',
                        where: {
                            id: id,
                        }
                    },
                    {
                        association: 'stage',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        association: 'product',
                        attributes: ['name', 'price', 'description'],
                        required: false
                    }

                ]
            },
        )
        const budgets = await Budget.findAll(
            {
                association: 'client',
                where: {
                    client_id: id,
                }
            },
        )
        func.hello()
        res.render('clients/client', { client, orders, budgets })
    },

    async removeClient(req, res) {
        const { id } = req.params
        const client = await Client.findOne({ where: { id } })
        await Client.destroy({ where: { id } })

        res.redirect('/clients')
    },

    async editClient(req, res) {
        const { id } = req.params
        const client = await Client.findOne({ where: { id }, include: { association: 'addresses' } })
        console.log(client)
        res.render('clients/editclient', { client })
    },

    async updateClient(req, res) {
        try {
            const id = req.body.id

            const { typeclient, email, cpf, phone, whatsapp, number, code, obs } = req.body
            const name = req.body.name.toUpperCase()
            const fantasy = req.body.fantasy.toUpperCase()
            const street = req.body.street.toUpperCase()
            const complement = req.body.complement.toUpperCase()
            const district = req.body.district.toUpperCase()
            const city = req.body.city.toUpperCase()
            let client = await Client.findOne({ where: { id } })

            if (!client) {
                res.status(401).json({ message: "Cliente não encontrado!" })
            } else {
                const client = await Client.update({ name, typeclient, fantasy, email, cpf, phone, whatsapp, obs }, { where: { id } })
                let address = await Address.findOne({ where: { client_id: id } })
                if (!address) {
                    const client_id = id
                    const address = await Address.create({ street, number, complement, district, city, code, client_id })

                } else {
                    const address = await Address.update({ street, number, complement, district, city, code }, { where: { client_id: id } })
                }
                res.redirect(`/client/${id}`)
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

}