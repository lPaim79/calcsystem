const Paper = require('../models/Paper')
const Provider = require('../models/Provider')
const Address = require('../models/Address')
module.exports = {
    async insertProvider(req, res) {
        try {
            const { name, email, phone, whatsapp, street, number, complement, district, city, code, site, obs } = req.body
            const provider = await Provider.findOne({ where: { email } })
            if (provider) {
                res.status(401).json({ massage: "Email já cadastrado!" })
            } else {
                const provider = await Provider.create({ name, email, phone, whatsapp, site, obs })
                const provider_id = provider.id
                const address = await Address.create({ street, number, complement, district, city, code, provider_id })
                res.redirect('/providers')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listProviders(req, res) {
        const providers = await Provider.findAll({ include: { association: 'addresses' }, limit: 20, order: [['name', 'ASC']] })
        console.log(providers)
        res.render('providers/providers', { providers })
    },

    async createProvider(req, res) {
        res.render('providers/createprovider')
    },

    async showProvider(req, res) {
        const { id } = req.params
        const provider = await Provider.findOne({ where: { id }, include: { association: 'addresses' } })
        console.log(provider)
        res.render('providers/provider', { provider })
    },

    async removeProvider(req, res) {
        const { id } = req.params
        const provider = await Provider.findOne({ where: { id } })
        Provider.destroy({ where: { id } })

        res.redirect('/providers')
    },

    async editProvider(req, res) {
        const { id } = req.params
        const provider = await Provider.findOne({ where: { id }, include: { association: 'addresses' } })
        console.log(provider)
        res.render('providers/editprovider', { provider })
    },

    async updateProvider(req, res) {
        try {
            const id = req.body.id

            const { name, email, phone, whatsapp, street, number, complement, district, city, code, site, obs } = req.body
            let provider = await Provider.findOne({ where: { id } })

            if (!provider) {
                res.status(401).json({ message: "Fornecedor não encontrado!" })
            } else {
                const provider = await Provider.update({ name, email, phone, whatsapp, site, obs }, { where: { id } })
                let address = await Address.findOne({ where: {provider_id: id}})
                if(!address){
                    const provider_id = id
                    const address = await Address.create({ street, number, complement, district, city, code, provider_id })  
                    
                }else{
                    const address = await Address.update({ street, number, complement, district, city }, { where: { provider_id: id  }})
                } 
                res.redirect('/providers')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
}