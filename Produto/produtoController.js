const express = require('express')
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Categoria = require("../DataBases/Categoria")
const Estoque = require("../DataBases/Estoque")
const Sequelize = require('sequelize')


router.get("/admin/produto/novo", (req, res) => {
    Categoria.findAll().then(categorias => {
        Grade.findAll().then(grades => {
            res.render("admin/produto/novo", { categorias: categorias, grades:grades })
        })
    })
})

router.post("/produto/novo",(req,res)=>{
    var nome = req.body.nome
    var descricao = req.body.descricao
    var status =  req.body.status
    var categoriaId = req.body.categoriaId
    var gradeId = req.body.gradeId

    console.log("nome")
    console.log(nome)
    console.log("descricao")
    console.log(descricao)
    console.log("status")
    console.log(status)
    console.log("categoriaId")
    console.log(categoriaId)
    console.log("gradeId")
    console.log(gradeId)
})
module.exports = router