const { Model, DataTypes } = require('sequelize')

class Budgetmaterial extends Model {
    static init(sequelize) {
        super.init({
            quantity: DataTypes.INTEGER,
            quantforunit: DataTypes.BOOLEAN,
            amount: DataTypes.DOUBLE,        
        }, {
            sequelize
        })
    }

    static associate (models) {
        this.belongsTo(models.Material,
            {
                foreignKey: 'material_id', as: 'material'
            });
        this.belongsTo(models.Budget,
            {
                foreignKey: 'budget_id', as: 'budget'
            });
    }
}

module.exports = Budgetmaterial


