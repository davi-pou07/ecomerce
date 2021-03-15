const express = require('express')
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')

//Novo
router.get("/admin/grade/novo", (req, res) => {
    res.render("admin/grade/novo")
})

router.post("/grade/salvar", (req, res) => {
    var descricao = req.body.descricao
    var linha = req.body.linha
    var coluna = req.body.coluna
    var status = req.body.status
    Grade.create({
        descricao: descricao,
        status: status,
        linha:linha,
        coluna:coluna
    }).then(() => {
        
        res.redirect("/admin/categoria/novo")
    })
})

module.exports = router