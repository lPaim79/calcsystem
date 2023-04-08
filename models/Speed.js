const { Model, DataTypes } = require('sequelize')

class Speed extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            capacity: DataTypes.INTEGER
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Printer,
            { 
                foreignKey: 'printer_id', as: 'printer'
            },
            models.Machine,
            {
                foreignKey: 'machine_id', as: 'machine'
            }
        )
    }

}

module.exports = Speed