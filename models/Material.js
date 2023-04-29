const { Model, DataTypes } = require('sequelize')

class Material extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            width: DataTypes.FLOAT,
            height: DataTypes.FLOAT,
            color: DataTypes.STRING,
            price: DataTypes.DOUBLE,
            efficiency: DataTypes.INTEGER,
            unitprice: DataTypes.DOUBLE       
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Provider,
            {
                foreignKey: 'provider_id', as: 'provider'
            }
        );
        this.hasMany(models.Budgetmaterial,
            {
                foreignKey: 'material_id', as: 'budgetmaterials'
            }            
        );
    }
}

module.exports = Material