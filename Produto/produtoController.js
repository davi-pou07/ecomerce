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

//Listar
router.get("/admin/produtos", (req, res) => {
    Produto.findAll().then(produtos => {
        Preco.findAll().then(precos => {
            res.render("admin/produto/index", { produtos: produtos, precos: precos })
        })
    })
})

//Editar
router.get("/admin/produto/editar/:produtoId", (req, res) => {
    var produtoId = req.params.produtoId
    if (produtoId != undefined) {
        if (!isNaN(produtoId)) {
            Produto.findByPk(produtoId).then(produto => {
                //valid
                Categoria.findAll().then(categorias => {
                    Preco.findOne({ where: { produtoId: produtoId } }).then(preco => {
                        Grade.findAll().then(grades => {
                            res.render("admin/produto/edit", { produto: produto, categorias: categorias, preco: preco, grades: grades })
                        }).catch(err =>{
                            res.send("Sem grades cadastradas")
                        })
                    }).catch(err =>{
                        res.send("Preços não cadastrado")
                    })
                }).catch(err =>{
                    res.send("Categoria não encontrada")
                })
            }).catch(err =>{
                res.send("Produto não encontrado")
            })
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
})
module.exports = router