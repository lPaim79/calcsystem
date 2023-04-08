const Stage = require('../models/Stage')
module.exports = {
    async insertStage(req, res) {
        try {
            const { name, description } = req.body
            const stage = await Stage.findOne({ where: { name } })
            if (stage) {
                res.status(401).json({ massage: "Estágio já cadastrado!" })
            } else {
                const stage = await Stage.create({ name, description })
                
                res.redirect('stages')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listStages(sreq, res) {
        const stages = await Stage.findAll({ limit: 20, order: [['name', 'ASC']] })
        console.log(stages)
        res.render('stages/stages', { stages })
    },

    async createStage(req, res) {
        res.render('stages/createstage')
    },

    async showStage(req, res) {
        const { id } = req.params
        const stage = await Stage.findOne({ where: { id } })
        console.log(stage)
        res.render('stages/stage', { stage })
    },

    async removeStage(req, res) {
        const { id } = req.params
        const stage = await Stage.findOne({ where: { id } })
        Stage.destroy({ where: { id } })

        res.redirect('/stages')
    },

    async editStage(req, res) {
        const { id } = req.params
        const stage = await Stage.findOne({ where: { id } })
        console.log(stage)
        res.render('stages/editstage', { stage })
    },

    async updateStage(req, res) {
        try {
            const id = req.body.id

            const { name, description } = req.body
            let stage = await Stage.findOne({ where: { id } })

            if (!stage) {
                res.status(401).json({ message: "Estágio não encontrado!" })
            } else {
                const stage = await Stage.update({ name, description }, { where: { id } })

                res.redirect('/stages')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
}