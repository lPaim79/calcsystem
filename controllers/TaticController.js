const Tatic = require('../models/Tatic')
const Machine = require('../models/Machine')
const Input = require('../models/Input')
const Provider = require('../models/Provider')

module.exports = {
    async insertTatic(req, res) {
        try {
            const { name, description, minimun_value, preparation_time, loss, capacity, price } = req.body
            const tatic = await Tatic.findOne({ where: { name } })
            if (tatic) {
                res.status(401).json({ massage: "Processo já cadastrado!" })
            } else {
                const tatic = await Tatic.create({ name, description, minimun_value, preparation_time, loss, capacity, price })
                res.redirect('/tatics')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listTatics(req, res) {
        const tatics = await Tatic.findAll();
        console.log(tatics)
        res.render('tatics/tatics', { tatics })
    },

    async createTatic(req, res) {
        const machines = await Machine.findAll()
        const inputs = await Input.findAll()
        res.render('tatics/createtatic', { machines, inputs })
    },

    async showTatic(req, res) {
        const { id } = req.params
        const tatic = await Tatic.findOne(
            {
                where: { id } , include: ['machines', 'inputs']
            },
            { association: 'machines',
        attributes: ['name'],
        required: false
        });
        console.log(tatic)
        res.render('tatics/tatic', { tatic })
    },

    async removeTatic(req, res) {
        const { id } = req.params
        const tatic = await Tatic.findOne({ where: { id } })
        Tatic.destroy({ where: { id } })

        res.redirect('/tatics')
    },

    async editTatic(req, res) {
        const { id } = req.params
        const tatic = await Tatic.findOne(
            {
                where: { id }
            }
        )
        console.log(tatic)
        res.render('tatics/edittatic', { tatic })
    },

    async updateTatic(req, res) {
        try {
            const id = req.body.id
            const { name, description, minimun_value, preparation_time, loss, capacity, price } = req.body
            const tatic = await Tatic.findOne({ where: { id } })
            if (!tatic) {
                res.status(401).json({ message: "Processo não encontrado!" })
            } else {
                const tatic = await Tatic.update({ name, description, minimun_value, preparation_time, loss, capacity, price }, { where: { id } })

                res.redirect('/tatics')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async insertinput(req, res) {
        const {id} = req.params
        const tatic = await Tatic.findByPk(id)
        const providers = await Provider.findAll()
        res.render('tatics/createinput', { tatic, providers })
    },

    async saveTaticInput(req, res) {
        const tatic_id = req.body.id
        const { name, description, price, efficiency, provider_id } = req.body
        const unitprice = price / efficiency
        const tatic = await Tatic.findByPk(tatic_id)

        if (!tatic) {
            return res.status(400).json({ error: 'Processo não localizado' })
        }

        const [ input ] = await Input.findOrCreate({
            where: { name, description, price, efficiency, unitprice, provider_id}
        });

        await TaticInputCreate({
            where: {input:'id', tatic:'id'}
        })

        await tatic.addInput(input)
        res.redirect('/tatics')

    },

    async createmachine (req, res) {
        const id = req.params.id
        const tatic = await Tatic.findByPk(id)
        res.render('tatics/createmachine', { tatic })
    },

    async savetaticmachine (req, res) {
        const tatic_id = req.body.id
        const { name, hour_price, preparation_time, width, height, description } = req.body

        const tatic = await Tatic.findByPk(tatic_id)

        if (!tatic) {
            return res.status(400).json({ error: 'Processo não encontrado!' })
        }
        const [ machine ] = await Machine.findOrCreate({
            where: { name, hour_price, preparation_time, width, height, description }
        })
        
        await tatic.addMachine(machine)
        
        console.log(machine)

        res.redirect('/tatics')
    }

}