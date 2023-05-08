const Op = require("sequelize")
module.exports = {
    async hello(req, res) {
        console.log('hello world')
    },
    async search(search, table) {
        const ClassName = require("../models/"+table)
        const query = `LIKE '%' + ${search} + '%'`
        /* const query = "SELECT * FROM " + table + " WHERE name LIKE '%" + search + "%'"
        const result = await Op.query */
        const result = ClassName.findAll({
            where: {
                name: {
                    query
                }                
            }
        })
        return console.log(result)
    }
}