const { Model, DataTypes } = require('sequelize')

class Speed extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            capacity: DataTypes.DOUBLE
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
            },
        );
        this.hasMany(models.Print,
            {
                foreignKey: 'speed_id', as: 'prints'
            },
        );
    }

}

module.exports = Speed