const { Model, DataTypes } = require('sequelize')

class Order extends Model {
    static init(sequelize) {
        super.init({
            date: DataTypes.DATE,
            description: DataTypes.STRING,
            price: DataTypes.FLOAT,
            payment: DataTypes.FLOAT,
            prevision: DataTypes.DATE,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Client,
            {
                foreignKey: 'client_id', as: 'client',
                required: true,
            }),
            this.belongsTo(models.Product,
            {
                foreignKey: 'product_id', as: 'product',
                required: true,
            }),
            this.belongsTo(models.Stage,
            {
                foreignKey: 'stage_id', as: 'stage',
                required: true,
            }
        );
    }
}

module.exports = Order

