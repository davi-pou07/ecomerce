const express = require('express')
const router = express.Router()
const Categoria = require("../DataBases/Categoria")

router.get("/admin/categoria/novo", (req, res) => {
    res.render("admin/categoria/novo")
})

router.post("/categorias/salvar", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    var status = req.body.status
    var destaque = req.body.destaque
    console.log(titulo)
    Categoria.create({
        titulo: titulo,
        descricao: descricao,
        status: status,
        destaque: destaque
    }).then(() => {
        res.redirect("/admin/categoria/novo")
    })
})

module.exports = router