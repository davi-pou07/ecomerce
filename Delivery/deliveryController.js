const express = require("express")
const router = express.Router()
const LocaisDelivery = require("../DataBases/LocaisDelivery")
const cidadesEstados = require("../DataBases/estados-cidades")

router.get("/admin/delivery/definir-preco", (req, res) => {
    var estados = cidadesEstados.estados
    res.render("admin/delivery/definir",{estados:estados})
})



module.exports = router