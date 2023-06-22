const Material = require('../models/Material')
const Provider = require('../models/Provider')
module.exports = {
    async insertMaterial(req, res) {
        try {
            const { name, description, width, height, color, efficiency, provider_id } = req.body
            const price = req.body.price.replace(",",".")
            const material = await Material.findOne({ where: { name } })
            if (material) {
                res.status(401).json({ massage: "Insumo já cadastrado!" })
            } else {
                const unitprice = await price / efficiency
                const material = await Material.create({ name, description, width, height, color, price, efficiency, unitprice, provider_id })

                res.redirect('/materials')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listMaterials(req, res) {
        try {
            const materials = await Material.findAll({
                include: { association: 'provider' }
            })
            if(!materials){
                console.log('Não há insumos cadastrados!')
                return
            }else{
                console.log(materials)
                res.render('materials/materials', { materials })
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async createMaterial(req, res) {
        const providers = await Provider.findAll()
        res.render('materials/creatematerial', { providers })
    },

    async showMaterial(req, res) {
        const { id } = req.params
        const material = await Material.findOne({ where: { id }, include: { association: 'provider' } })
        console.log(material)
        res.render('materials/material', { material })
    },

    async removeMaterial(req, res) {
        const { id } = req.params
        const material = await Material.findOne({ where: { id } })
        Material.destroy({ where: { id } })

        res.redirect('/materials')
    },

    async editMaterial(req, res) {
        const { id } = req.params
        console.log(id)
        const provider = await Provider.findAll()
        const material = await Material.findOne({ where: { id }, include: { association: 'provider' } })
        res.render('materials/editmaterial', { material, provider })
    },

    async updateMaterial(req, res) {
        try {
            const id = req.body.id

            const { name, description, width, height, color, efficiency, provider_id  } = req.body
            const price = req.body.price.replace(",",".")
            let material = await Material.findOne({ where: { id } })

            if (!material) {
                res.status(401).json({ message: "Papel não encontrado!" })
            } else {
                const unitprice = parseFloat(price) / efficiency
                const material = await Material.update({ name, description, width, height, color, price, efficiency, unitprice, provider_id }, { where: { id } })

                res.redirect('/materials')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
}