const { Model, DataTypes } = require('sequelize')

class Printer extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            preparation_time: DataTypes.FLOAT,
            width: DataTypes.FLOAT,
            height: DataTypes.FLOAT,
            color: DataTypes.BOOLEAN,
            min_grammage: DataTypes.FLOAT,
            max_grammage: DataTypes.FLOAT,
            hour_price: DataTypes.FLOAT,
        }, {
            sequelize,
            tableName: 'printers',
        })
    }

    static associate(models) {
        this.hasMany(models.Input,
            {
                foreignKey: 'printer_id', as: 'inputs'
            },
            models.Speed,
            {
                foreignKey: 'printer_id', as: 'speeds'
            }
        );
    }

}

module.exports = Printer