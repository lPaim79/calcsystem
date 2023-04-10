const Budget = require('../models/Budget')
const Client = require('../models/Client')
const Tatic = require('../models/Tatic')
const Paper = require('../models/Paper')
const Printer = require('../models/Printer')
const Print = require('../models/Print')
const Material = require('../models/Material')
const Provider = require('../models/Provider')
const Budgetmaterial = require('../models/Budgetmaterial')
const Budgettatic = require('../models/Budgettatic')
const Order = require('../models/Order')
const Product = require('../models/Product')

const BudgetController = require('../controllers/BudgetController')


module.exports = {
    async insertBudget(req, res) {
        try {
            const date = new Date()
            const { name, quantity, description, markup, obs, prevision, type, client_id } = req.body
            const createbudget = await Budget.create({ date, name, quantity, description, markup, obs, prevision, type, client_id })
            const id = createbudget.id
            const budget = await Budget.findOne({
                where: { id },
                include: [
                    {
                        association: 'client',
                        attributes: ['name'],
                        required: false
                    }]
            })
            // res.redirect('/budgets')
            res.render('budgets/budget', { budget })
        }
        catch (error) {
            res.status(400).json({ error })
        }
    },

    async listBudgets(req, res) {
        const budgets = await Budget.findAll({
            include: [
                {
                    association: 'client',
                    attributes: ['id', 'name', 'fantasy'],
                    required: false
                }
            ], limit: 30, order: [['date', 'DESC']]
        });
        res.render('budgets/budgets', { budgets })
    },

    async createbudget(req, res) {
        const clients = await Client.findAll({ order: [['name', 'ASC']] })
        res.render('budgets/createbudget', { clients })
    },

    async showBudget(req, res) {
        const { id } = req.params
        const budget = await Budget.findOne({
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
            ],
            where: { id }
        })
        res.render('budgets/budget', { budget })
    },

    async removeBudget(req, res) {
        const { id } = req.params
        const budget = await Budget.findOne({ where: { id } })
        await Budget.destroy({ where: { id } })
        res.redirect('/budgets')
    },

    async editBudget(req, res) {
        const { id } = req.params
        const clients = await Client.findAll()
        const budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
            ],
        })
        console.log(budget.client_id)
        res.render('budgets/editbudget', { budget, clients })
    },

    async showBudgetsClient(req, res) {
        const { id } = req.params
        const client = await Client.findByPk(id)
        const budgets = await Budget.findAll(
            {
                include: [
                    {
                        association: 'client',
                        attributes: ['name'],
                        where: {
                            id: id,
                        }
                    }
                ]
            },
        )
        res.render('budgets/budgetsClient', { budgets, client })
    },

    async updateBudget(req, res) {
        try {
            const id = req.body.id
            const { date, name, quantity, description, markup, obs, prevision, client_id } = req.body
            const budget = await Budget.update({ date, name, quantity, description, markup, obs, prevision, client_id }, { where: { id } })
            res.redirect('/budget/' + id)
        }
        catch (error) {
            res.status(400).json({ error })
        }
    },

    async alterDate(req, res) {
        const id = req.params
        const budget = await Budget.findOne({
            where: { id }
        })
        console.log('Alterar Data')
        res.render('budgets/alterdate', { budget })
    },

    async updateDate(req, res) {
        const id = req.body.id
        const { date, description, price, payment, prevision, client_id, product_id, stage_id } = req.body
        const budget = await Budget.update({ date, description, price, payment, prevision, client_id, product_id, stage_id }, { where: { id } })
        res.redirect('/budgets')
    },

    async calculate(req, res) {
        const { id } = req.params
        const budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
            ],
        })
        var tatics_value = 0
        for (i = 0; i < budget.budgettatics.length; i++) {
            tatics_value += budget.budgettatics[i].amount
        }

        var materials_value = 0
        for (i = 0; i < budget.budgetmaterials.length; i++) {
            materials_value += budget.budgetmaterials[i].amount
        }

        var prints_value = 0
        for (i = 0; i < budget.prints.length; i++) {
            prints_value += budget.prints[i].amount
        }
        prints_value *= budget.quantity

        let resultado = (tatics_value + materials_value + prints_value) * budget.markup
        let price = resultado.toFixed(2)

        let budgets = await Budget.update({ price, tatics_value, materials_value, prints_value }, { where: { id } })
        res.redirect('/budgets')
    },

    async appoved(req, res) {
        const id = req.params.id
        var budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    required: false
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
            ],
        })

        try {
            let date = new Date()
            const prev = await budget.prevision

            const name = budget.name + ', ' + budget.quantity + ' un'
            const description = budget.description
            const price = budget.price
            const payment = 0
            const weight = 0
            const type = budget.type
            const client_id = budget.client.id
            var prevision = new Date()
            prevision.setDate(prevision.getDate() + prev)

            console.log(date)
            console.log(prev)
            console.log(prevision)

            const product = await Product.create({ name, description, price, weight, type })
            const product_id = product.id
            const stage_id = 1
            const order = await Order.create({ date, description, price, payment, prevision, client_id, product_id, stage_id })
            res.redirect('/orders')
        }
        catch (error) {
            res.status(400).json({ error })
        }
    },

    async clonebudget(req, res) {
        const { id } = req.params
        const budget = await Budget.findOne({
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
            ],
            where: { id }
        })
        console.log(budget)
        //res.render('budgets/budget', { budget })
    },

    //TATIC//
    async createtatic(req, res) {
        const { id } = req.params
        const budget = await Budget.findByPk(id)
        const tatics = await Tatic.findAll({
            where: {
                singleprocess: true,
            }, order: [['name', 'ASC']]
        })
        res.render('budgets/createtatic', { budget, tatics })
    },

    async selectbudgettatic(req, res) {
        const id = req.params.id
        const { tatic_id } = req.body
        var budget = await Budget.findByPk(id)
        const tatic = await Tatic.findByPk(tatic_id)


        if (tatic.typequantity == 'unit') {
            var time = ((budget.quantity + tatic.loss) / tatic.capacity) + (tatic.preparation_time / 60)
        } else {
            var time = 60 / tatic.capacity / 60
        }

        var amount = tatic.price * time
        if (amount < tatic.minimun_value) {
            amount = tatic.minimun_value
        }
        const hourprice = tatic.price
        const budget_id = budget.id
        const budgettatic = await Budgettatic.create({ time, hourprice, amount, budget_id, tatic_id })

        res.redirect(`/budget/${id}`)
    },

    async savebudgettatic(req, res) {
        const id = req.params.id
        var totalprints = 0;
        const budget = await Budget.findOne({
            where: { id } ,
            include: [
                {
                    association: 'prints',
                    attributes: ['width' , 'height', 'quantity', 'sides'],
                    required: true, include: {
                        association: 'printer',
                    }
                },               
                        
            ]
        })
       
        const { name, description, minimun_value, preparation_time, loss, capacity, price, typequantity } = req.body

        if (!budget) {
            return res.status(400).json({ error: 'Orçamento não localizado!' })
        }

        const tatic = await Tatic.create({ name, description, minimun_value, preparation_time, loss, capacity, price, typequantity }
        );

        const tatic_id = tatic.id
        var time = 0
        switch (typequantity) {
            case 'total':
                var amount = price
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                time = 60 / tatic.capacity
                break
            case 'unit':
                time = ((parseInt(budget.quantity) + parseInt(tatic.loss)) / tatic.capacity) + (tatic.preparation_time / 60)
                var amount = price * (time / 60)
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                break
            case 'print':
                var prints_quantity = 0
                var format
                for (i = 0; i < budget.prints.length; i++) {
                    const aux = await (budget.prints[i].width / budget.prints[i].printer.width) * (budget.prints[i].height / budget.prints[i].printer.height)
                    const aux2 = await (budget.prints[i].width / budget.prints[i].printer.height) * (budget.prints[i].height / budget.prints[i].printer.width) 
                    if (aux > aux2) {
                        format = aux
                    }else{
                        format = aux2
                    }
                    prints_quantity += (budget.prints[i].quantity / format) * budget.prints[i].sides
                }
                time = (((parseInt(budget.quantity) + parseInt(tatic.loss)) * prints_quantity) / tatic.capacity) + (tatic.preparation_time / 60)
                //time = ((((budget.quantity  + tatic.loss) * prints_quantity) * budget.prints.sides) / tatic.capacity) + (tatic.preparation_time / 60)
                var amount = price * (time / 60)
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                break
        }
        const hourprice = price
        const budget_id = id
        console.log(amount)
        const budgettatic = await Budgettatic.create({ time, hourprice, amount, budget_id, tatic_id })

        res.redirect(`/budget/${id}`)
    },

    async removetatic(req, res) {
        var id = req.params.id
        const budgettatic = await Budgettatic.findOne({ where: { id } })
        const budget_id = budgettatic.budget_id
        await budgettatic.destroy({ where: { id } })
        id = budget_id
        res.redirect('/budget/' + id)
    },

    async taticedit(req, res) {
        var id = req.params.id
        const budgettatic = await Budgettatic.findOne({
            where: { id },
            include: [
                {
                    association: 'budget',
                },
                {
                    association: 'tatic',
                },
            ],
        })
        const tatics = await Tatic.findAll()
        res.render('budgets/budgettaticedit', { budgettatic, tatics })
    },

    async updatetatic(req, res) {
        try {
            const { id, name, description, minimun_value, preparation_time, loss, capacity, price, quantforunit } = req.body
            const tatic = await Tatic.update({ name, description, minimun_value, preparation_time, loss, capacity, price }, { where: { id } })
        } catch (error) {
            console.log(error)
        }
    },

    //PRINT//
    async createprint(req, res) {
        const { id } = req.params
        const printers = await Printer.findAll()
        const budget = await Budget.findByPk(id)
        const papers = await Paper.findAll()
        res.render('budgets/createprint', { budget, papers, printers })
    },

    async savebudgetprint(req, res) {
        const id = req.params.id
        const budget_id = id
        var input = 0
        const { printer_id, paper_id, description, quantity, sides, width, height, color, coverage } = req.body

        if (!printer_id) {
            return res.status(400).json({ error: 'É obrigatório selecionar uma impressora!' })
        }
        if (!paper_id) {
            return res.status(400).json({ error: 'É obrigatório selecionar um papel!' })
        }
        if (!description) {
            return res.status(400).json({ error: 'É obrigatório informar a descrição!' })
        }
        if (!quantity) {
            return res.status(400).json({ error: 'É obrigatório informar a quantidade!' })
        }
        if (!width) {
            return res.status(400).json({ error: 'É obrigatório informar a largura!' })
        }
        if (!height) {
            return res.status(400).json({ error: 'É obrigatório informar a altura!' })
        }
        if (!coverage) {
            return res.status(400).json({ error: 'É obrigatório informar a área de cobertura!' })
        }

        const printer = await Printer.findOne({
            include: 'inputs',
            where: { id: printer_id }
        })

        const paper = await Paper.findByPk(paper_id)
        const format1 = await (parseInt(paper.height / height)) * (parseInt(paper.width / width))
        const format2 = await (parseInt(paper.height / width)) * (parseInt(paper.width / height))
        if (format1 > format2) {
            var format = await format1
        } else {
            var format = await format2
        }

        if (paper.height > printer.height && paper.width > printer.width) {
            const aux1 = await (parseInt(printer.height / height)) * (parseInt(printer.width / width))
            const aux2 = await (parseInt(printer.height / width)) * (parseInt(printer.width / height))
            if (aux1 > aux2) {
                var printformat = aux1
                const largura = await parseInt(printer.height / height)
                const altura = await parseInt(printer.width / width)
                var paperheight = await height * largura
                var paperwidth = await width * altura
                const aux3 = await (parseInt(paper.height / paperheight))
                const aux4 = await (parseInt(paper.width / paperwidth))
                var paperformat = aux3 * aux4
                var aprov = await largura * altura
            } else {
                var printformat = aux2
                const largura = await parseInt(printer.width / height)
                const altura = await parseInt(printer.height / width)
                var paperheight = await height * largura
                var paperwidth = await width * altura
                const aux3 = await (parseInt(paper.width / paperheight))
                const aux4 = await (parseInt(paper.height / paperwidth))
                var paperformat = await aux3 * aux4
                var aprov = await largura * altura
            }
        } else {
            var printformat = format
            var paperformat = 1
            var aprov = format
            var paperheight = paper.height
            var paperwidth = paper.width
        }

        var papercoust = (paper.unitprice / format) * quantity
        for (let index = 0; index < printer.inputs.length; index++) {
            if (printer.inputs[index]) {
                input += await printer.inputs[index].unitprice;
            }
        }
        if (paperheight > 320 || paperwidth > 320) {
            var printcoust = await (quantity / aprov) * (((input * 5 / 100) * coverage) * 2 * sides)
            var amount = await papercoust + printcoust
        } else {
            var printcoust = await (quantity / aprov) * (((input * 5 / 100) * coverage) * sides)
            var amount = await papercoust + printcoust
        }

        const print = await Print.findOrCreate({
            where: { description, quantity, sides, width, height, format, color, coverage, amount, paper_id, printer_id, budget_id }
        })

        const budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgettatics',
                    required: false, include: {
                        association: 'tatic'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
            ],
        });
        res.render('budgets/budget', { budget })
    },

    async removeprint(req, res) {
        var id = req.params.id
        const print = await Print.findOne({ where: { id } })
        const budget_id = print.budget_id
        await print.destroy({ where: { id } })
        id = budget_id
        res.redirect('/budget/' + id)
    },

    //MATERIAL
    async creatematerial(req, res) {
        const { id } = req.params
        const materials = await Material.findAll()
        const budget = await Budget.findByPk(id)
        const providers = await Provider.findAll()
        res.render('budgets/creatematerial', { budget, materials, providers })
    },

    async selectbudgetmaterial(req, res) {
        const id = req.params.id
        const { material_id, quantity, quantforunit } = req.body
        var amount = 0
        const material = await Material.findByPk(material_id)
        var budget = await Budget.findByPk(id)
        if (quantforunit == 'true') {
            amount = quantity * material.unitprice * budget.quantity
        } else {
            amount = quantity * material.unitprice
        }
        const budget_id = id
        const budgetmaterial = await Budgetmaterial.create({ budget_id, material_id, quantity, quantforunit, amount })
        budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
            ],
        });

        res.render('budgets/budget', { budget })
    },

    async savebudgetmaterial(req, res) {
        const id = req.params.id
        const { name, description, width, height, color, price, efficiency, provider_id, quantity, quantforunit } = req.body
        const unitprice = await price / efficiency
        const material = await Material.create({ name, description, width, height, color, price, efficiency, unitprice, provider_id });

        var amount = 0
        if (quantforunit == 'true') {
            var budget = await Budget.findByPk(id)
            amount = await quantity * material.unitprice * budget.quantity
        } else {
            amount = await quantity * material.unitprice
        }
        material_id = material.id
        const budget_id = id
        const budgetmaterial = await Budgetmaterial.create({ budget_id, material_id, quantity, quantforunit, amount })

        budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'client',
                    attributes: ['name'],
                    required: false
                },
                {
                    association: 'budgettatics',
                    required: false,
                    include: {
                        association: 'tatic'
                    }
                },
                {
                    association: 'prints',
                    required: false, include: {
                        association: 'paper'
                    }
                },
                {
                    association: 'budgetmaterials',
                    required: false,
                    include: {
                        association: 'material'
                    }
                },
            ],
        });

        res.render('budgets/budget', { budget })
    },

    async removematerial(req, res) {
        var id = req.params.id
        const budgetmaterial = await Budgetmaterial.findOne({ where: { id } })
        const budget_id = budgetmaterial.budget_id
        await budgetmaterial.destroy({ where: { id } })
        id = budget_id
        res.redirect('/budget/' + id)
    },

}