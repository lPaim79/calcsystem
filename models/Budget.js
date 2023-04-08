const { Model, DataTypes } = require('sequelize')

class Budget extends Model {
    static init(sequelize) {
        super.init({
            date: DataTypes.DATE,
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
            markup: DataTypes.FLOAT,
            price: DataTypes.FLOAT,
            prevision: DataTypes.INTEGER,
            type: DataTypes.STRING,
            obs: DataTypes.STRING,
            tatics_value: DataTypes.FLOAT,
            materials_value: DataTypes.FLOAT,
            prints_value: DataTypes.FLOAT             
        }, {
            sequelize
        })
    }
    static associate (models) {
        this.belongsTo(models.Client,
            {
                foreignKey: 'client_id', as: 'client'
            }
        );
        this.hasMany(models.Budgettatic,
            {
                foreignKey: 'budget_id', as: 'budgettatics'
            }            
        );
        this.hasMany(models.Budgetmaterial,
            {
                foreignKey: 'budget_id', as: 'budgetmaterials'
            }            
        );
        this.hasMany(models.Print,
            {
                foreignKey: 'budget_id', as: 'prints'
            }
        );
    }
}
module.exports = Budget