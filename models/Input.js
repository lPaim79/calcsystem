const { Model, DataTypes } = require('sequelize')

class Input extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.FLOAT,
            efficiency: DataTypes.INTEGER,
            unitprice: DataTypes.FLOAT
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Machine,
            {
                foreignKey: 'machine_id', as: 'machine',
                allowNull: true,
                required: false,
            });
        this.belongsTo(models.Provider,
            {
                foreignKey: 'provider_id', as: 'provider',
                required: true,
            });
        this.belongsTo(models.Printer,
            {
                foreignKey: 'printer_id', as: 'printer',
                allowNull: true,
                required: false,
            });
        this.belongsToMany(models.Tatic,
            {
                foreignKey: 'input_id', through: 'tatic_inputs', as: 'tatics'
            });
    }
}
module.exports = Input