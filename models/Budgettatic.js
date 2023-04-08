const { Model, DataTypes } = require('sequelize')

class Budgettatic extends Model {
    static init(sequelize) {
        super.init({
            time: DataTypes.FLOAT,
            hourprice: DataTypes.FLOAT,
            amount: DataTypes.FLOAT,   
        }, {
            sequelize,
            tableName: 'budgettatics',
        })
    }

    static associate (models) {
        this.belongsTo(models.Tatic,
            {
                foreignKey: 'tatic_id', as: 'tatic'
            });
        this.belongsTo(models.Budget,
            {
                foreignKey: 'budget_id', as: 'budget'
            });
    }
}

module.exports = Budgettatic