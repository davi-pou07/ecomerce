const express = require("express")
const router = express.Router()
const LocaisDelivery = require("../DataBases/LocaisDelivery")
const cidadesEstados = require("../DataBases/estados-cidades")


router.get("/admin/delivery/definir-preco", (req, res) => {
    var estados = cidadesEstados.estados
    res.render("admin/delivery/definir", { estados: estados })
})

router.get("/cidades/filtro/:estado", async (req, res) => {
    var estado = req.params.estado

    var locaisDelivery = await LocaisDelivery.findAll({ where: { estado: estado } })
    var estados = cidadesEstados.estados
    var cidades = estados.find(est => est.nome == estado)
    res.json({ cidades: cidades, locaisDelivery: locaisDelivery })
})

router.post("/delivery/adicionar", async (req, res) => {
    var { estado, cidade, bairro, preco } = req.body
    var localDelivery = await LocaisDelivery.findOne({ where: { estado: estado, cidade: cidade, bairro: bairro } })
    if (localDelivery == undefined) {
        LocaisDelivery.create({
            estado: estado,
            cidade: cidade,
            preco: preco,
            bairro: bairro
        }).then(resp => {
            res.json(resp)
        })
    } else {
        var resp = await atualizar(localDelivery.id, cidade, bairro, preco)
        res.json(resp)
    }
})

router.post("/delivery/deletar/:id", async (req, res) => {
    var id = req.params.id
    var localDelivery = await LocaisDelivery.findByPk(id)
    if (localDelivery != undefined) {
        LocaisDelivery.destroy({ where: { id: localDelivery.id } }).then(() => {
            res.json({ resp: "Exclusão concluida" })
        })
    } else {
        res.json({ erro: "Impossivel efetuar a exclusão" })
    }
})

async function atualizar(id, cidade, bairro, preco) {
    var localDelivery = await LocaisDelivery.findByPk(id)
    if (localDelivery != undefined) {
        LocaisDelivery.update({
            cidade: cidade,
            bairro: bairro,
            preco: preco
        }, { where: { id: localDelivery.id } }).then(() => {
            return ({ resp: "Atualização concluida" })
        })
    } else {
        return ({ erro: "Impossivel efetuar a atualização" })
    }
}

router.post("/delivery/atualizar/:id", async (req, res) => {
    var id = req.params.id
    var {cidade,bairro,preco} = req.body
    var localDelivery = await LocaisDelivery.findByPk(id)
    if (localDelivery != undefined) {
        var resp = await atualizar(localDelivery.id, cidade, bairro, preco)
        res.json(resp)
    } else {
        res.json({ erro: "Impossivel efetuar a atualização" })
    }
})

module.exports = router