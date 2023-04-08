const Sequelize = require('sequelize');

const configDB = require('../config/database');

const Address = require('../models/Address');
const Budget = require('../models/Budget')
const Client = require('../models/Client');
const Input = require('../models/Input');
const Machine = require('../models/Machine');
const Material = require('../models/Material');
const Order = require('../models/Order');
const Paper = require('../models/Paper');
const Print = require('../models/Print');
const Printer = require('../models/Printer');
const Product = require('../models/Product');
const Provider = require('../models/Provider');
const Speed = require('../models/Speed');
const Stage = require('../models/Stage');
const Tatic = require('../models/Tatic');
const Budgetmaterial = require('../models/Budgetmaterial');
const Budgettatic = require('../models/Budgettatic')

const connection = new Sequelize(configDB)

Address.init(connection);
Budget.init(connection);
Client.init(connection);
Input.init(connection);
Machine.init(connection);
Material.init(connection);
Order.init(connection);
Paper.init(connection);
Print.init(connection);
Printer.init(connection);
Product.init(connection);
Provider.init(connection);
Speed.init(connection);
Stage.init(connection);
Tatic.init(connection);
Budgetmaterial.init(connection);
Budgettatic.init(connection);

Address.associate(connection.models);
Budget.associate(connection.models);
Client.associate(connection.models);
Input.associate(connection.models);
Machine.associate(connection.models);
Material.associate(connection.models);
Order.associate(connection.models);
Paper.associate(connection.models);
Print.associate(connection.models);
Printer.associate(connection.models);
Product.associate(connection.models);
Provider.associate(connection.models);
Speed.associate(connection.models);
Stage.associate(connection.models);
Tatic.associate(connection.models);
Budgetmaterial.associate(connection.models);
Budgettatic.associate(connection.models);

module.exports = connection;