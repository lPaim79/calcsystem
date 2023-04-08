const Address = require('../models/Address')
const Client = require('../models/Client')
const Order = require('../models/Order')
module.exports = {
    async insertClient(req, res) {
        try {
            const { name, typeclient, fantasy, email, cpf, phone, whatsapp, street, number, complement, district, city, code, obs } = req.body
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
        const clients = await Client.findAll({ include: { association: 'addresses' }, limit: 20, order: [['name', 'ASC']] })
        console.log(clients)
        res.render('clients/clients', { clients })
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
            },)

        res.render('clients/client', { client, orders })
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

            const { name, typeclient, fantasy, email, cpf, phone, whatsapp, street, number, complement, district, city, code, obs } = req.body
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
                    const address = await Address.update({ street, number, complement, district, city }, { where: { client_id: id } })
                }
                res.redirect('/clients')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

}