const { Model, DataTypes } = require('sequelize')

class Client extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            typeclient: DataTypes.BOOLEAN,
            fantasy: DataTypes.STRING,
            email: DataTypes.STRING,
            cpf: DataTypes.STRING,
            phone: DataTypes.STRING,
            whatsapp: DataTypes.STRING,
            obs: DataTypes.STRING            
        }, {
            sequelize
        })
    }
    static associate (models) {
        this.hasMany(models.Order,
            {
                foreignKey: 'client_id', as: 'orders'
            }
        )
        this.hasOne(models.Address,
            {
                foreignKey: 'client_id', as: 'addresses'
            } 
            )
    }
}

module.exports = Client