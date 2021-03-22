const express = require('express')
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Categoria = require("../DataBases/Categoria")
const Estoque = require("../DataBases/Estoque")
const Sequelize = require('sequelize')
const Produto = require('../DataBases/Produto')
const Preco = require('../DataBases/Preco')

router.get("/admin/produto/novo", (req, res) => {
    Categoria.findAll().then(categorias => {
        Grade.findAll().then(grades => {
            res.render("admin/produto/novo", { categorias: categorias, grades: grades })
        })
    })
})

router.post("/produto/novo", (req, res) => {
    var nome = req.body.nome
    var descricao = req.body.descricao
    var status = req.body.status
    var categoriaId = req.body.categoriaId
    var gradeId = req.body.gradeId

    var venda = req.body.venda
    var custo = req.body.custo
    var desconto = req.body.desconto

    if(desconto == '' ||desconto == undefined){
        desconto = 0
    }
    if(venda == '' ||venda == undefined){
        venda = 0
    }
    if(custo == '' ||custo == undefined){
        custo = 0
    }
    if(gradeId == '' ||gradeId == undefined){
        gradeId = 0
    }
    if(categoriaId == '' ||categoriaId == undefined){
        categoriaId = 0
    }
    Produto.create({
        nome: nome,
        descricao: descricao,
        status: status,
        categoriaId: categoriaId,
        gradeId: gradeId
    }).then(produto => {
        Preco.create({
            venda: venda,
            custo: custo,
            desconto: desconto,
            produtoId: produto.id
        }).then(() => {
            res.redirect("/admin/produtos")
        })
    })
})

router.get("/admin/produtos",(req,res)=>{
    Produto.findAll().then(produtos =>{
        Preco.findAll().then(precos =>{
            res.render("admin/produto/index",{produtos:produtos,precos:precos})
        })
    })
})

module.exports = router