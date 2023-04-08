const { Model, DataTypes } = require('sequelize')

class Provider extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            whatsapp: DataTypes.STRING,
            site: DataTypes.STRING,
            obs: DataTypes.STRING
        }, {
            sequelize,
            tableName: 'providers',
        })
    }

    static associate(models) {
        this.hasMany(models.Paper,
            {
                foreignKey: 'provider_id', as: 'papers'
            }),
            this.hasMany(
            models.Input,
            {
                foreignKey: 'provider_id', as: 'inputs'
            }),
            this.hasMany(
            models.Material,
            {
                foreignKey: 'provider_id', as: 'materials'
            }
        );
         this.hasOne(models.Address,
            {
                foreignKey: 'provider_id', as: 'addresses'
            }
        );
    }
}

module.exports = Provider