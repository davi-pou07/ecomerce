const express = require("express")
const router = express.Router()
const LocaisDelivery = require("../DataBases/LocaisDelivery")
const cidadesEstados = require("../DataBases/estados-cidades")

router.get("/admin/delivery/definir-preco", (req, res) => {
    var estados = cidadesEstados.estados
    res.render("admin/delivery/definir",{estados:estados})
})

router.get("/cidades/filtro/:estado",(req,res)=>{
    var estado = req.params.estado
    var estados = cidadesEstados.estados
    var cidades = estados.find(est => est.nome == estado)
    res.json({cidades:cidades})
})

module.exports = router