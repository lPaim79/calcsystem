const Paper = require('../models/Paper')
const Provider = require('../models/Provider')
module.exports = {
    async insertPaper(req, res) {
        try {
            const { name, description, width, height, color, grammage, efficiency, provider_id } = req.body
            const price = req.body.price.replace(",",".")
            const paper = await Paper.findOne({ where: { name } })
            if (paper) {
                res.status(401).json({ massage: "Papel já cadastrado!" })
            } else {
                const unitprice = parseFloat(price)/ efficiency 
                const paper = await Paper.create({ name, description, width, height, color, grammage, price, efficiency, unitprice, provider_id })
                res.redirect('/papers')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listPapers(req, res) {
        const papers = await Paper.findAll({
            include: { association: 'provider' }
        })
        res.render ('papers/papers', {papers})
    },

    async createPaper(req, res) {
        const providers = await Provider.findAll()
        res.render('papers/createpaper', { providers })
    },

    async showPaper(req, res) {
        const { id } = req.params
        const paper = await Paper.findOne({ where: { id } ,  include: { association: 'provider' } })
        console.log(paper)
        res.render('papers/paper', { paper })
    },

    async removePaper(req, res) {
        const { id } = req.params
        const paper = await Paper.findOne({ where: { id } })
        Paper.destroy({ where: { id } })

        res.redirect('/papers')
    },

    async editPaper(req, res) {
        const { id } = req.params
        const provider = await Provider.findAll()
        const paper = await Paper.findOne({ where: { id }, include: { association: 'provider' } })
        console.log(paper)
        res.render('papers/editpaper', { paper, provider })
    },

    async updatePaper(req, res) {
        try {
            const id = req.body.id

            const { name, description, width, height, color, grammage, efficiency, provider_id } = req.body
            const price = req.body.price.replace(",",".")
            let paper = await Paper.findOne({ where: { id } })
            console.log(price)
            if (!paper) {
                res.status(401).json({ message: "Papel não encontrado!" })
            } else {
                const unitprice = price / efficiency
                const paper = await Paper.update({ name, description, width, height, color, grammage, price, efficiency, unitprice, provider_id }, { where: { id } })

                res.redirect('/papers')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
}