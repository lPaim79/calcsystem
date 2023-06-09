const { Model, DataTypes } = require('sequelize')

class Print extends Model {
    static init(sequelize) {
        super.init({
            description: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
            sides: DataTypes.INTEGER,
            width: DataTypes.FLOAT,
            height: DataTypes.FLOAT,
            electroniccut: DataTypes.BOOLEAN,
            paperwidth: DataTypes.FLOAT,
            paperheight: DataTypes.FLOAT,
            format: DataTypes.INTEGER,
            printformat: DataTypes.INTEGER,
            color: DataTypes.BOOLEAN,
            coverage: DataTypes.INTEGER,
            amount: DataTypes.DOUBLE,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(
            models.Paper,
            {
                foreignKey: 'paper_id', as: 'paper'
            }
        );
        this.belongsTo(
            models.Printer,
            {
                foreignKey: 'printer_id', as: 'printer'
            }
        );
        this.belongsTo(
            models.Budget,
            {
                foreignKey: 'budget_id', as: 'budget'
            }
        );
        this.belongsTo(
            models.Speed,
            {
                foreignKey: 'speed_id', as: 'speed'
            }
        );
    }

}

module.exports = Print