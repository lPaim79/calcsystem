const Speed = require('../models/Speed')

module.exports = {
    async insertregisterspeed(req, res) {
        console.log('Entrou')
        const printer_id = req.params.id
        const name = req.body.name
        var speed = req.body.capacity
        const capacity = speed * 60
        console.log (printer_id , name, speed, capacity)
        speed = await Speed.create({ name, capacity, printer_id})
        res.redirect(`/printer/${printer_id}`)
    }
}