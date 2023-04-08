const { Model, DataTypes } = require('sequelize')

class Machine extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            hour_price: DataTypes.FLOAT,
            preparation_time: DataTypes.FLOAT,
            width: DataTypes.FLOAT,
            height: DataTypes.FLOAT,
            description: DataTypes.STRING
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.hasMany(models.Input,
            {
                foreignKey: 'machine_id', as: 'inputs'
            });
            this.hasMany(models.Speed,
            {
                foreignKey: 'machine_id', as: 'speeds'
            }
        );
        this.belongsToMany(models.Tatic,
            {
                foreignKey: 'machine_id', through: 'machine_tatics', as: 'tatics'
            }
            );
    }
}

module.exports = Machine