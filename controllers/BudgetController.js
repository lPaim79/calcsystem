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
const { Op } = require('sequelize')

const BudgetController = require('../controllers/BudgetController')

module.exports = {
    async insertBudget(req, res) {
        try {
            const date = new Date()
            const { name, quantity, description, markup, obs, prevision, type, client_id } = req.body
            const createbudget = await Budget.create({ date, name, quantity, description, markup, obs, prevision, type, client_id })
            const id = createbudget.id
            res.redirect('/budget/' + id)
        }
        catch (error) {
            res.status(400).json({ error })
        }
    },

    async listBudgets(req, res) {
        let search = ''
        let budgets = ''
        let order = 'DESC'
        if (req.body.search){
            search = req.body.search            
            const budgetsData = await Budget.findAll({
                include: {
                    association: 'client', 
                    attributes: ['name' , 'fantasy']
                },
                where: {
                    [Op.or]: {
                        name: { [Op.like]: `%${search}%` },
                        description: { [Op.like]: `%${search}%` },
                    }
                },
                order: [['date', order]]
            })
            console.log(budgetsData)
            budgets = budgetsData.map((result) => result.get({ plain: true }))
            let budgetsQty = budgets.length

            if (budgetsQty === 0){
                budgetsQty = false
            }
            res.render('budgets/budgets', { budgets, budgetsQty, search})
        }
        else {
           const { page = 1 } = req.query
           const limit = 20;
           var lastPage = 1;
           const countBudgets = await Budget.count();
           lastPage = Math.ceil(countBudgets / limit)
            budgets = await Budget.findAll({
                include: { association: 'client' },
                order: [['date', 'DESC']],
                offset:Number((page*limit) - limit),
                limit: limit
            });
            if (budgets) {
                var pagination = {
                    path: '/budgets',
                    page,
                    prev_page_url: Number(page) - Number(1) >= 1 ? Number(page) - Number(1) : false,
                    next_page_url: Number(page) + Number(1) <= lastPage ? Number(page) + Number(1) : false,
                    //next_page_url: Number(page) + Number(1) >= lastPage ? lastPage : Number(page) + Number(1),
                    lastPage,
                    total: countBudgets,
                }    
            }
            res.render('budgets/budgets', {budgets, pagination})
        }        
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
        const id = req.params.id
        const budget = await Budget.findOne({
            where: { id }
        })
        console.log(id)
        res.render('budgets/alterdate', { budget })
    },

    async updateDate(req, res) {
        const id = req.params.id
        const date = req.body.date
        const budget = await Budget.update({ date }, { where: { id } })
        res.redirect(`/budgetedit/${id}`)
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
        res.redirect('/budget/' + id)
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
        var budget = await Budget.findOne({
            include: [
                {
                    association: 'client',
                    attributes: ['id'],
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
        const date = new Date()
        const name = budget.name
        const quantity = budget.quantity
        const description = budget.description
        const markup = budget.markup
        const obs = budget.obs
        const prevision = budget.prevision
        const type = budget.type
        const client_id = budget.client.id
        const createbudget = await Budget.create({ date, name, quantity, description, markup, obs, prevision, type, client_id })

        const budget_id = createbudget.id
        if (budget.prints) {
            const createprint = (async function () {
                console.log(budget.prints.length)
                for (let i = 0; i < budget.prints.length; i++) {
                    const description = budget.prints[i].description
                    const quantity = budget.prints[i].quantity
                    const sides = budget.prints[i].sides
                    const width = budget.prints[i].width
                    const height = budget.prints[i].height
                    const paperwidth = budget.prints[i].paperwidth
                    const paperheight = budget.prints[i].paperheight
                    const format = budget.prints[i].format
                    const printformat = budget.prints[i].printformat
                    const color = budget.prints[i].color
                    const coverage = budget.prints[i].coverage
                    const amount = budget.prints[i].amount
                    const paper_id = budget.prints[i].paper_id
                    const printer_id = budget.prints[i].printer_id

                    const print = await Print.findOrCreate({
                        where: { description, quantity, sides, width, height, paperwidth, paperheight, format, printformat, color, coverage, amount, paper_id, printer_id, budget_id }

                    })
                }
            })();
        }

        if (budget.budgettatics) {
            const createbudgettatic = (async function () {
                console.log(budget.budgettatics.length)
                for (let i = 0; i < budget.budgettatics.length; i++) {

                    const time = budget.budgettatics[i].time
                    const hourprice = budget.budgettatics[i].hourprice
                    const amount = budget.budgettatics[i].amount
                    const budget_id = createbudget.id
                    const tatic_id = budget.budgettatics[i].tatic_id

                    const budgettatic = await Budgettatic.create({ time, hourprice, amount, budget_id, tatic_id })
                }
            })();
        }

        if (budget.budgetmaterials) {
            const createbudgetmaterial = (async function () {
                console.log(budget.budgetmaterials.length)
                for (let i = 0; i < budget.budgetmaterials.length; i++) {
                    const material_id = budget.budgetmaterials[i].material_id
                    const quantity = budget.budgetmaterials[i].quantity
                    const quantforunit = budget.budgetmaterials[i].quantforunit
                    const amount = budget.budgetmaterials[i].amount
                    const budgetmaterial = await Budgetmaterial.create({ budget_id, material_id, quantity, quantforunit, amount })
                }
            })();
        }

        res.redirect('/budgets/')
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
        var budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'prints',
                }
            ]
        })
        const tatic = await Tatic.findByPk(tatic_id)

        var time = 0
        var amount = 0

        switch (tatic.typequantity) {

            case 'total':
                console.log('Cálculo Total')
                amount = tatic.price
                if (amount < tatic.minimun_value) {
                    amount = tatic.minimun_value
                }
                time = tatic.preparation_time
                break

            case 'unit':
                console.log('Calculo por unidades do orçamento')
                time = ((parseInt(budget.quantity) + parseInt(tatic.loss)) / tatic.capacity) + (tatic.preparation_time / 60)
                amount = tatic.price * time
                if (amount < tatic.minimun_value) {
                    amount = tatic.minimun_value
                }
                break

            case 'print':
                console.log('Cálculo por impressões')
                //soma a quantidade de impressões
                var prints_quantity = 0
                for (let i = 0; i < budget.prints.length; i++) {
                    let aux = await budget.prints[i].quantity * budget.quantity
                    let aux2 = await aux / budget.prints[i].printformat
                    prints_quantity += await aux2 * parseInt((budget.prints[i].sides))
                }

                //calcula o tempo do processo
                time = ((parseInt(prints_quantity) + (parseInt(tatic.loss))) / (parseInt(tatic.capacity))) + (parseFloat(tatic.preparation_time / 60))

                //calcula o valor do processo -> Revisar o cálculo
                amount = tatic.price * time
                if (amount < tatic.minimun_value) {
                    amount = tatic.minimun_value
                }
                break
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
            where: { id },
            include: [
                {
                    association: 'prints',
                    attributes: ['width', 'height', 'quantity', 'sides', 'paperwidth', 'paperheight', 'printformat'],
                    required: true, include: {
                        association: 'printer',
                    }
                },
            ]
        })
        const { name, description, preparation_time, loss, capacity, typequantity, singleprocess } = req.body
        const minimun_value = req.body.minimun_value.replace(",", ".")
        const price = req.body.price.replace(",", ".")
        if (!budget) {
            return res.status(400).json({ error: 'Orçamento não localizado!' })
        }

        var tatic = await Tatic.create({ name, description, minimun_value, preparation_time, loss, capacity, price, typequantity, singleprocess }
        );

        const tatic_id = tatic.id
        var time = parseInt(0)

        switch (typequantity) {
            case 'total':
                console.log('Cálculo Total')
                var amount = price
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                time = preparation_time
                break
            case 'unit':
                console.log('Calculo por unidades do orçamento')
                time = ((parseInt(budget.quantity) + parseInt(tatic.loss)) / tatic.capacity) + (tatic.preparation_time / 60)
                var amount = price * time
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                break
            case 'print':
                console.log('Cálculo por impressões')
                //soma a quantidade de impressões
                var prints_quantity = 0
                for (let i = 0; i < budget.prints.length; i++) {
                    let aux = await budget.prints[i].quantity * budget.quantity
                    let aux2 = await aux / budget.prints[i].printformat
                    prints_quantity += await aux2 * parseInt((budget.prints[i].sides))
                }

                //calcula o tempo do processo
                time = ((parseInt(prints_quantity) + (parseInt(tatic.loss))) / (parseInt(tatic.capacity))) + (parseFloat(tatic.preparation_time / 60))

                //calcula o valor do processo -> Revisar o cálculo
                var amount = price * time
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                break
        }

        const hourprice = price
        const budget_id = id
        const budgettatic = await Budgettatic.create({ time, hourprice, amount, budget_id, tatic_id })

        res.redirect(`/budget/${id}`)
    },

    async removetatic(req, res) {
        var id = req.params.id
        const budgettatic = await Budgettatic.findOne({
            where: { id },
            include: [
                {
                    association: 'tatic',
                    attributes: ['id', 'singleprocess']
                },
            ]
        })
        var budget_id = budgettatic.budget_id
        if (!budgettatic.tatic.singleprocess) {
            const id = budgettatic.tatic.id
            const tatic = await Tatic.destroy({ where: { id } })
        }

        await budgettatic.destroy({ where: { id } })
        id = budgettatic.budget_id
        res.redirect('/budget/' + id)
    },

    async budgettaticedit(req, res) {
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
        console.log(budgettatic)
        res.render('budgets/budgettaticedit', { budgettatic })
    },

    async updatetatic(req, res) {

        var id = req.params.id
        const { name, description, preparation_time, loss, capacity, singleprocess, typequantity } = req.body
        const minimun_value = req.body.minimun_value.replace(",", ".")
        const price = req.body.price.replace(",", ".")
        var tatic = await Tatic.update({ name, description, minimun_value, preparation_time, loss, capacity, price, typequantity, singleprocess }, { where: { id } })
        tatic = await Tatic.findByPk(id)
        id = req.body.budget_id
        var totalprints = 0;
        const budget = await Budget.findOne({
            where: { id },
            include: [
                {
                    association: 'prints',
                    attributes: ['width', 'height', 'quantity', 'sides', 'paperwidth', 'paperheight', 'printformat'],
                    required: true, include: {
                        association: 'printer',
                    }
                },
            ]
        })

        const tatic_id = req.params.id
        var time = 0
        switch (typequantity) {
            case 'total':
                var amount = price
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                time = preparation_time
                break
            case 'unit':
                time = ((parseInt(budget.quantity) + parseInt(tatic.loss)) / tatic.capacity) + (tatic.preparation_time / 60)
                var amount = price * time
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                break
            case 'print':
                var prints_quantity = 0

                //soma a quantidade de impressões
                for (let i = 0; i < budget.prints.length; i++) {
                    prints_quantity += await (budget.prints[i].quantity / budget.prints[i].printformat) * (budget.prints[i].sides * budget.quantity)
                }

                //calcula o tempo do processo
                time = ((prints_quantity + tatic.loss) / tatic.capacity) + (tatic.preparation_time / 60)

                //calcula o valor do processo -> Revisar o cálculo
                var amount = price * time
                if (amount < minimun_value) {
                    amount = minimun_value
                }
                break
        }
        console.log(prints_quantity, tatic.loss, tatic.capacity, tatic.preparation_time, time)

        const hourprice = price

        id = req.body.budgettatic_id

        const budget_id = req.body.budget_id
        const budgettatic = await Budgettatic.update({ time, hourprice, amount, budget_id, tatic_id }, { where: { tatic_id, budget_id } })

        // id = req.body.budget_id
        res.redirect(`/budget/${budget_id}`)
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
        var id = req.params.id
        const budget_id = id
        var input = 0
        const { printer_id, paper_id, description, quantity, sides, width, height, electroniccut, color, coverage } = req.body

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
        if (!width || !height) {
            return res.status(400).json({ error: 'É obrigatório informar o tamanho final!' })
        }
        if (!coverage) {
            return res.status(400).json({ error: 'É obrigatório informar a área de cobertura!' })
        }

        const printer = await Printer.findOne({
            include: 'inputs',
            where: { id: printer_id }
        })
        const paper = await Paper.findByPk(paper_id)

        //verifica se o tamanho do papel é compatível com a impressora ou necessita de corte
        if (paper.width <= printer.width || paper.height <= printer.height) {
            var paperwidth = await paper.width
            var paperheight = await paper.height
        } else {
            var { paperwidth, paperheight } = req.body
            console.log(paperwidth, paperheight)
        }

        if (!paperwidth || !paperheight) {
            return res.status(400).json({ error: 'É obrigatório informar o tamanho da impressão!' })
        }

        /* if (((paperheight < height) || (paperwidth < width)) && ((paperwidth < height) || (paperheight < width))) {
            console.log(paperwidth , paperheight)
            console.log(height , width)
            return res.status(400).json({ error: 'Tamanho do papel não pode ser menor que o impresso!' })
        } */

        //texta os dois sentidos do papel em relação ao original para descobrir o melhor aproveitamento determinando o formato
        var aux1 = await (parseInt(paper.height / height)) * (parseInt(paper.width / width))
        var aux2 = await (parseInt(paper.height / width)) * (parseInt(paper.width / height))
        if (aux1 > aux2) {
            var format = await aux1
        } else {
            var format = await aux2
        }

        //caLcula a quantidade de originais por impressão
        console.log(electroniccut)
        switch (electroniccut) {
            case 'true':
                var paper_height = await paperheight - 20
                var paper_width = await paperwidth - 20
                break

            case 'false':
                var paper_height = await paperheight - 10
                var paper_width = await paperwidth - 10
                break
        }

        aux1 = await (parseInt(paper_height / height)) * (parseInt(paper_width / width))
        aux2 = await (parseInt(paper_height / width)) * (parseInt(paper_width / height))
        if (aux1 > aux2) {
            var printformat = aux1
        } else {
            var printformat = aux2
        }
        if (paper.height < printer.height && paper.width < printer.width) {
            var paperformat = 1
            var aprov = printformat
        }

        var papercoust = (paper.unitprice / format) * quantity
        for (let index = 0; index < printer.inputs.length; index++) {
            if (printer.inputs[index]) {
                input += await printer.inputs[index].unitprice;
            }
        }

        if (paperheight > 320 || paperwidth > 320) {
            var printcoust = await (quantity / printformat) * (((input * 5 / 100) * coverage) * 2 * sides)
            var amount = await papercoust + printcoust
            console.log('papel maior', amount)
        } else {
            var printcoust = await (quantity / printformat) * (((input * 5 / 100) * coverage) * sides)
            var amount = await papercoust + printcoust
            console.log('papel menor ', amount)
        }

        const print = await Print.create({ description, quantity, sides, width, height, paperwidth, paperheight, format, printformat, color, coverage, amount, paper_id, printer_id, budget_id })

        res.redirect('/budget/' + id)
    },

    async removeprint(req, res) {
        var id = req.params.id
        const print = await Print.findOne({ where: { id } })
        const budget_id = print.budget_id
        await print.destroy({ where: { id } })
        id = budget_id
        res.redirect('/budget/' + id)
    },

    async editprint(req, res) {
        var id = req.params.id
        const print = await Print.findOne({
            where: { id },
            include:
                [
                    {
                        association: 'budget'
                    },
                    {
                        association: 'printer'
                    },
                    {
                        association: 'paper'
                    }
                ]
        })
        const papers = await Paper.findAll()
        const printers = await Printer.findAll()
        res.render(`budgets/printedit`, { print, printers, papers })
    },

    async updatebudgetprint(req, res) {
        const id = req.body.id
        const budget_id = id

        console.log(id, budget_id)

        var input = 0
        const { print_id, printer_id, paper_id, description, quantity, sides, width, height, color, coverage } = req.body

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
        if (!width || !height) {
            return res.status(400).json({ error: 'É obrigatório informar o tamanho final!' })
        }
        if (!coverage) {
            return res.status(400).json({ error: 'É obrigatório informar a área de cobertura!' })
        }

        const printer = await Printer.findOne({
            include: 'inputs',
            where: { id: printer_id }
        })
        const paper = await Paper.findByPk(paper_id)

        //verifica se o tamanho do papel é compatível com a impressora ou necessita de corte
        if (paper.width <= printer.width || paper.height <= printer.height) {
            var paperwidth = await paper.width
            var paperheight = await paper.height
        } else {
            var { paperwidth, paperheight } = req.body
            console.log(paperwidth, paperheight)
        }

        if (!paperwidth || !paperheight) {
            return res.status(400).json({ error: 'É obrigatório informar o tamanho da impressão!' })
        }

        /* if ((paperheight < height || paperwidth < width) && (paperwidth < height || paperheight < width)) {
            console.log(paperwidth , paperheight)
            console.log(height , width)
            return res.status(400).json({ error: 'Tamanho do papel não pode ser menor que o impresso!' })
        }
        return */

        //texta os dois sentidos do papel em relação ao original para descobrir o melhor aproveitamento determinando o formato
        var aux1 = await (parseInt(paper.height / height)) * (parseInt(paper.width / width))
        var aux2 = await (parseInt(paper.height / width)) * (parseInt(paper.width / height))
        if (aux1 > aux2) {
            var format = await aux1
        } else {
            var format = await aux2
        }

        //caLcula a quantidade de originais por impressão
        aux1 = await (parseInt(paperheight / height)) * (parseInt(paperwidth / width))
        aux2 = await (parseInt(paperheight / width)) * (parseInt(paperwidth / height))
        if (aux1 > aux2) {
            var printformat = aux1
        } else {
            var printformat = aux2
        }
        if (paper.height < printer.height && paper.width < printer.width) {
            var paperformat = 1
            var aprov = printformat
        }

        var papercoust = (paper.unitprice / format) * quantity
        for (let index = 0; index < printer.inputs.length; index++) {
            if (printer.inputs[index]) {
                input += await printer.inputs[index].unitprice;
            }
        }

        if (paperheight > 320 || paperwidth > 320) {
            var printcoust = await (quantity / printformat) * (((input * 5 / 100) * coverage) * 2 * sides)
            var amount = await papercoust + printcoust
            console.log('papel maior', amount)
        } else {
            var printcoust = await (quantity / printformat) * (((input * 5 / 100) * coverage) * sides)
            var amount = await papercoust + printcoust
            console.log('papel menor ', amount)
        }

        const print = await Print.update({ description, quantity, sides, width, height, paperwidth, paperheight, format, printformat, color, coverage, amount, paper_id, printer_id, budget_id }, { where: { id: print_id } })

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

        res.redirect(`/budget/${id}`)
    },

    async savebudgetmaterial(req, res) {
        const id = req.params.id
        const { name, description, width, height, color, efficiency, provider_id, quantity, quantforunit } = req.body
        const price = req.body.price.replace(",", ".")
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

        res.redirect(`/budget/${id}`)
    },

    async materialedit(req, res) {
        const id = req.params.id
        const budgetmaterial = await Budgetmaterial.findOne({
            where: { id },
            include:
                [
                    {
                        association: 'material',
                        include: {
                            association: 'provider',
                        }
                    }
                ]
        })
        console.log(budgetmaterial)
        const providers = await Provider.findAll()
        res.render('budgets/budgetmaterialedit', { budgetmaterial, providers })
    },

    async updatbudgetematerial(req, res) {
        const id = req.params.id
        const material_id = id
        const { name, description, width, height, color, efficiency, provider_id, quantity, quantforunit, budgetmaterial_id, budget_id } = req.body
        const price = req.body.price.replace(",", ".")
        const unitprice = await price / efficiency
        const material = await Material.update({ name, description, width, height, color, price, efficiency, unitprice, provider_id }, { where: { id } });

        var amount = 0
        if (quantforunit == 'true') {
            let id = budget_id
            var budget = await Budget.findByPk(id)
            amount = await quantity * material.unitprice * budget.quantity
        } else {
            amount = await quantity * material.unitprice
        }

        const budgetmaterial = await Budgetmaterial.update({ budget_id, material_id, quantity, quantforunit, amount }, { where: { budget_id, material_id } })

        res.render(`budgets/budget${budget_id}`)
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