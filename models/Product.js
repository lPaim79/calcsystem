const { Model, DataTypes } = require('sequelize')

class Product extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.FLOAT,
            weight: DataTypes.FLOAT,
            type: DataTypes.STRING,         
        }, {
            sequelize
        })
    }
    static associate (models) {
        this.hasMany(models.Order,
            {
                foreignKey: 'product_id', as: 'orders'
            }
        )
    }
}

module.exports = Product