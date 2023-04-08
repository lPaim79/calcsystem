const { Model, DataTypes } = require('sequelize')

class Address extends Model {
    static init(sequelize) {
        super.init({
            street: DataTypes.STRING,
            number: DataTypes.STRING,
            complement: DataTypes.STRING,
            district: DataTypes.STRING,
            city: DataTypes.STRING,
            code: DataTypes.STRING,            
        }, {
            sequelize,
            tableName: 'addresses',
        })
    }
    static associate (models) {
        this.belongsTo(models.Client,
            {
                foreignKey: 'client_id', as: 'client'
            },
                models.Provider,
            {
                foreignKey: 'provider_id', as: 'provider'
            }
        );
    }
}

module.exports = Address