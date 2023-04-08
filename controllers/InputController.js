const Input = require('../models/Input')
const Machine = require('../models/Machine')
const Printer = require('../models/Printer')
const Provider = require('../models/Provider')
const Tatic = require('../models/Tatic')

/* module.exports = {
    async insertInput(req, res) {
        try {
            const { name, description, price, efficiency, provider_id, machine_id, printer_id } = req.body
            const input = await Input.findOne({ where: { name } })
            if (input) {
                res.status(401).json({ massage: "Insumo já cadastrado!" })
            } else {
                //const unitprice = parseFloat(price) / efficiency
                const unitprice = await price / efficiency
                const input = await Input.create({ name, description, price, efficiency, unitprice, provider_id, machine_id, printer_id })

                res.redirect('/inputs')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    }, */

    module.exports = {
        async insertTaticInput(req, res) {
            const tatic_id = req.body.id
            const { name, description, price, efficiency, provider_id } = req.body
            const unitprice = price / efficiency
            
            const tatic = await Tatic.findByPk(tatic_id)

            if (!tatic) {
                return res.status(400).json({ error: 'Processo não encontrado!' })
            }
            const [ input ] = await Input.findOrCreate({
                where: { name, description, price, efficiency, unitprice, provider_id }
            })
            
            await tatic.addInput(input)
            
            console.log(input)

            res.redirect('/tatics')
        },

        /* async insertInput(req, res) {
            
            const { name, description, price, efficiency, provider_id, machine_id, printer_id } = req.body
            const input = await Input.findOne({ where: { name } })
            if (input) {
                res.status(401).json({ massage: "Insumo já cadastrado!" })
            } else {
                //const unitprice = parseFloat(price) / efficiency
                const unitprice = await price / efficiency
                const input = await Input.create({ name, description, price, efficiency, unitprice, provider_id, machine_id, printer_id })

                res.redirect('/tatics')
            }
       
        }, */

    async listInputs(req, res) {
        const inputs = await Input.findAll(
            {
                include: [
                    {
                        association: 'provider',
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        association: 'machine',
                        attributes: ['id', 'name'],
                        required: false
                    },
                    {
                        association: 'printer',
                        attributes: ['id', 'name'],
                        required: false
                    }
                ],
            }
        );
        console.log(inputs)
        if (!inputs) {
            console.log('Não há insumos cadastrados!')
        } else {
            res.render('inputs/inputs', { inputs })
        }

    },

    async createInput(req, res) {
        const providers = await Provider.findAll()
        const machines = await Machine.findAll()
        const printers = await Printer.findAll()
        res.render('inputs/createinput', { providers, machines, printers })
    },

    async showInput(req, res) {
        const { id } = req.params
        const input = await Input.findOne({ where: { id }, include: [
            {
                association: 'provider',
                attributes: ['id', 'name'],
                required: false
            },
            {
                association: 'machine',
                attributes: ['id', 'name'],
                required: false
            },
            {
                association: 'printer',
                attributes: ['id', 'name'],
                required: false
            }
        ],
     })
        console.log(input)
        res.render('inputs/input', { input })
    },

    async removeInput(req, res) {
        const { id } = req.params
        const input = await Input.findOne({ where: { id } })
        await Input.destroy({ where: { id } })

        res.redirect('/inputs')
    },

    async editInput(req, res) {
        const { id } = req.params
        const provider = await Provider.findAll()
        const machine = await Machine.findAll()
        const printer = await Printer.findAll()
        const input = await Input.findOne({ where: { id }, 
            include: [
                {
                    association: 'provider',
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    association: 'machine',
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    association: 'printer',
                    attributes: ['id', 'name'],
                    required: false
                }
            ],
        })
        console.log(input)
        res.render('inputs/editinput', { input, provider, machine, printer })
    },

    async updateInput(req, res) {
        try {
            const id = req.body.id

            const { name, description, price, efficiency, provider_id, machine_id, printer_id } = req.body
            let input = await Input.findOne({ where: { id } })

            if (!input) {
                res.status(401).json({ message: "Papel não encontrado!" })
            } else {
                const unitprice = await parseFloat(price) / efficiency
                const input = await Input.update({ name, description, price, efficiency, unitprice, provider_id, machine_id, printer_id }, { where: { id } })

                res.redirect('/inputs')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
}