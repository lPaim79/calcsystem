const Printer = require('../models/Printer')
const Provider = require('../models/Provider')
const Input = require('../models/Input')
module.exports = {
    async insertPrinter(req, res) {
        try {
            const { name, description, preparation_time, width, height, color, min_grammage, max_grammage, hour_price} = req.body
            const printer = await Printer.findOne({ where: { name } })
            if (printer) {
                res.status(401).json({ massage: "Máquina já cadastrada!" })
            } else {
                const printer = await Printer.create({ name, description, preparation_time, width, height, color, min_grammage, max_grammage, hour_price })
                res.redirect('/printers')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async listPrinters(req, res) {
        try {
            const printers = await Printer.findAll()
            if(!printers){
                console.log('Não há impressoras cadastradas!')
                return
            }else{
                console.log(printers)
                res.render ('printers/printers', {printers})
            }
        } catch (error) {
            res.status(400).json({error})
        }
    },

    async createPrinter(req, res) {
        res.render('printers/createprinter')
    },

    async showPrinter(req, res) {
        const { id } = req.params
        var printer = await Printer.findOne({ where: { id }, include: { association: 'inputs', as: 'printers' } })
        console.log(printer)
        var totalprice = 0
        for (i=0; i<printer.inputs.length; i++){
            totalprice += printer.inputs[i].unitprice
        }
        res.render('printers/printer', { printer, totalprice })
    },

    async removePrinter(req, res) {
        const { id } = req.params
        const printer = await Printer.findOne({ where: { id } })
        Printer.destroy({ where: { id } })

        res.redirect('/printers')
    },

    async editPrinter(req, res) {
        const { id } = req.params
        const printer = await Printer.findOne({ where: { id } })
        console.log(printer)
        res.render('printers/editprinter', { printer })
    },

    async updatePrinter(req, res) {
        try {
            const id = req.body.id

            const { name, description, preparation_time, width, height, color, min_grammage, max_grammage, hour_price } = req.body
            let printer = await Printer.findOne({ where: { id } })
            if (!printer) {
                res.status(401).json({ message: "Máquina não encontrada!" })
            } else {
                const printer = await Printer.update({ name, description, preparation_time, width, height, color, min_grammage, max_grammage, hour_price }, { where: { id } })

                res.redirect('/printers')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },

    async createinput(req,res) {
        const id = req.params.id
        const printer = await Printer.findByPk(id)
        const providers = await Provider.findAll()
        res.render('printers/createinput', { printer, providers })
    },

    async saveprinterinput(req, res) {
        console.log('entrou')
        //const id = req.params.id
        const { id, name, description, price, efficiency, provider_id } = req.body
        const unitprice = await price / efficiency

        const printer = await Printer.findByPk(id)
        if (!printer) {
            return res.status(400).json({ error: 'Impressora não encontrada!' })
        }
        const printer_id = id
        const input = await Input.create({ name, description, price, efficiency, unitprice, provider_id, printer_id })
        res.redirect(`/printer/${id}`)
    },
}