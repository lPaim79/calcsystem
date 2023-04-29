const { Model, DataTypes } = require('sequelize')

class Paper extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            width: DataTypes.FLOAT,
            height: DataTypes.FLOAT,
            color: DataTypes.STRING,
            grammage: DataTypes.FLOAT,
            price: DataTypes.DOUBLE,
            efficiency: DataTypes.INTEGER,
            unitprice: DataTypes.DOUBLE          
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Provider,
            { foreignKey: 'provider_id', as: 'provider' }
        ),
        this.hasMany(models.Print,
            { foreignKey: 'paper_id', as: 'papers'}
        )
    }
}

module.exports = Paper