const { Model, DataTypes } = require('sequelize')

class Stage extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            sequelize
        })
    }
    static associate (models) {
        this.hasMany(models.Order,
            {
                foreignKey: 'stage_id', as: 'orders'
            }
        );
    }
}
module.exports = Stage