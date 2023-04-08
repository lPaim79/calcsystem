const { Model, DataTypes } = require('sequelize');

class Tatic extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            minimun_value: DataTypes.FLOAT,
            preparation_time: DataTypes.FLOAT,
            loss: DataTypes.INTEGER,
            capacity: DataTypes.INTEGER,
            price: DataTypes.FLOAT,
            singleprocess: DataTypes.BOOLEAN,
            typequantity: DataTypes.STRING,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.hasMany(models.Budgettatic,
            {
                foreignKey: 'tatic_id', as: 'budgettatics'
            });
        this.belongsToMany(models.Input,
            {
                foreignKey: 'tatic_id', through: 'tatic_inputs', as: 'inputs', constraint: true
            });
        this.belongsToMany(models.Machine,
            {
                foreignKey: 'tatic_id', through: 'machine_tatics', as: 'machines'
            });
    }
}
module.exports = Tatic