const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

const moment = require('moment')

const conn = require('./database')

//models
const Address = require('./models/Address');
const Budget = require('./models/Budget');
const Client = require('./models/Client');
const Input = require('./models/Input');
const Machine = require('./models/Machine');
const Material = require('./models/Material');
const Order = require('./models/Order');
const Paper = require('./models/Paper');
const Print = require('./models/Print');
const Printer = require('./models/Printer');
const Product = require('./models/Product');
const Provider = require('./models/Provider');
const Speed = require('./models/Speed');
const Stage = require('./models/Stage');
const Tatic = require('./models/Tatic');
const budgetmaterial = require('./models/Budgetmaterial');
const budgettatic = require('./models/Budgettatic')

//Routes
//const addressesRoutes = require('./routes/AddressRoutes')
const clientsRoutes = require('./routes/ClientRoutes')
const providersRoutes = require('./routes/ProviderRoutes')
const papersRoutes = require('./routes/PaperRoutes')
const inputsRoutes = require('./routes/InputRoutes')
const productsRoutes = require('./routes/ProductRoutes')
const printerRoutes = require('./routes/PrinterRoutes')
const stagesRoutes = require('./routes/StageRoutes')
const taticsRoutes = require('./routes/TaticRoutes')
const ordersRoutes = require('./routes/OrderRoutes')
const materialsRoutes = require('./routes/MaterialRoutes')
const machinesRoutes = require('./routes/MachineRoutes')
const budgetsRoutes = require('./routes/BudgetRoutes')
const registrationsRoutes = require('./routes/RegistrationRoutes')

const bodyparser = require('body-parser')

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        },
        formatPrice: (price) => {
            if (price) {
                return price.toLocaleString('pt-br', { minimumFractionDigits: 2 })
            }
            price = 0
            return price.toLocaleString('pt-br', { minimumFractionDigits: 2 })
        },
        formatSmallPrice: (price) => {
            if (price) {
                return price.toLocaleString('pt-br', { minimumFractionDigits: 3 })
            }
            price = 0
            return price.toLocaleString('pt-br', { minimumFractionDigits: 3 })
        },
        switch: (value, options) => {
            this.switch_value = value;
            return options.fn(this);
        },
        case: (value, options) => {
            if (value == this.switch_value) {
                return options.fn(this);
            }
        }
    }
}))

app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.static('public'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use(express.json())
app.use('/',
    budgetsRoutes,
    clientsRoutes,
    providersRoutes,
    papersRoutes,
    printerRoutes,
    inputsRoutes,
    productsRoutes,
    stagesRoutes,
    taticsRoutes,
    ordersRoutes,
    materialsRoutes,
    machinesRoutes,
    registrationsRoutes,
)

app.listen(3000)



