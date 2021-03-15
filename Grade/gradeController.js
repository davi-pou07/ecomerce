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

    var linha1 = req.body.linha1
    var linha2 = req.body.linha2
    var linha3 = req.body.linha3
    var linha4 = req.body.linha4
    var linha5 = req.body.linha5
    var linha6 = req.body.linha6
    var linha7 = req.body.linha7
    var linha8 = req.body.linha8
    var linha9 = req.body.linha9
    var linha10 = req.body.linha10

    var coluna1 = req.body.coluna1
    var coluna2 = req.body.coluna2
    var coluna3 = req.body.coluna3
    var coluna4 = req.body.coluna4
    var coluna5 = req.body.coluna5
    var coluna6 = req.body.coluna6
    var coluna7 = req.body.coluna7
    var coluna8 = req.body.coluna8
    var coluna9 = req.body.coluna9
    var coluna10 = req.body.coluna10
    
    Grade.create({
        descricao: descricao,
        status: status,
        linha:linha,
        coluna:coluna
    }).then(grade => {

    })
})

module.exports = router