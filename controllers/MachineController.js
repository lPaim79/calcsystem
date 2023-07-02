const Machine = require('../models/Machine')
const Provider = require('../models/Provider')
const Input = require('../models/Input')

module.exports = {
    async insertMachine(req, res) {
        try {
            const { name, preparation_time, width, height, description } = req.body
            const hour_price = req.body.hour_price.replace(",",".")
            const machine = await Machine.findOne({ where: { name } })
            if (machine) {
                res.status(401).json({ massage: "Máquina já cadastrada!" })
            } else {
                const machine = await Machine.create({ name, hour_price, preparation_time, width, height, description })
                res.redirect('/machines')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listMachines(req, res) {
        try {
            const machines = await Machine.findAll()
            if (!machines) {
                console.log('Não há máquinas cadastradas!')
                return
            } else {
                res.render('machines/machines', { machines })
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async createMachine(req, res) {
        const inputs = await Input.findAll()
        res.render('machines/createmachine', { inputs })
    },

    async showMachine(req, res) {
        const { id } = req.params
        const machine = await Machine.findOne({ where: { id }, include: { association: 'inputs', as: 'machines' } })
        res.render('machines/machine', { machine })
    },

    async removeMachine(req, res) {
        const { id } = req.params
        const machine = await Machine.findOne({ where: { id } })
        await Machine.destroy({ where: { id } })

        res.redirect('/machines')
    },

    async editMachine(req, res) {
        const { id } = req.params
        const machine = await Machine.findOne({ where: { id } })
        console.log(machine)
        res.render('machines/editmachine', { machine })
    },

    async updateMachine(req, res) {
        try {
            const id = req.body.id

            const { name, preparation_time, width, height, description } = req.body
            const hour_price = req.body.hour_price.replace(",",".")
            let machine = await Machine.findOne({ where: { id } })
            if (!machine) {
                res.status(401).json({ message: "Máquina não encontrada!" })
            } else {
                const machine = await Machine.update({ name, hour_price, preparation_time, width, height, description }, { where: { id } })

                res.redirect('/machines')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async createinput(req, res) {
        const id = req.params.id
        const machine = await Machine.findByPk(id)
        const providers = await Provider.findAll()
        res.render('machines/createinput', { machine, providers })
    },

    async savemachineinput(req, res) {
        console.log('entrou')
        //const id = req.params.id
        const { id, name, description, efficiency, provider_id } = req.body
        const price = req.body.price.replace(",",".")
        const unitprice = await price / efficiency

        const machine = await Machine.findByPk(id)
        if (!machine) {
            return res.status(400).json({ error: 'Maquina não encontrada!' })
        }
        const machine_id = id
        const input = await Input.create({ name, description, price, efficiency, unitprice, provider_id, machine_id })
        res.redirect('/machines')
    },
}