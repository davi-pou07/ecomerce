const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const StatusEntrega = require("../DataBases/StatusEntrega");
const auth = require("../middlewares/adminAuth")

router.get("/admin/criarStatus",auth, async (req, res) => {
    try {
        StatusEntrega.create({
            statusId: 1,
            status:"Aguardando Pagamento"
        })
        StatusEntrega.create({
            statusId: 2,
            status:"Em andamento"
        })
        StatusEntrega.create({
            statusId: 3,
            status:"Entregue"
        })
        StatusEntrega.create({
            statusId: 4,
            status:"Cancelada"
        })
    } catch (err) {
        res.json(err)
    }
})

module.exports = router