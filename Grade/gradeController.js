const express = require('express')
const router = express.Router()
const Grade = require("../DataBases/Grade")
const Sequelize = require('sequelize')

//Novo
router.get("/admin/grade/novo", (req, res) => {
    res.render("admin/grade/novo")
})

router.post("/grade/salvar", (req, res) => {
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