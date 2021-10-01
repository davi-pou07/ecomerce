const express = require("express")
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')
const { Op } = require("sequelize");
const Estoque = require("../DataBases/Estoque")
const Produto = require("../DataBases/Produto")
const { where } = require("sequelize")

router.get("/admin/estoques", (req, res) => {
    res.render("admin/estoque/index")
})

router.get("/admin/estoques/:produto", (req, res) => {
    var prode = req.params.produto

    Produto.findAll().then(produtos => {
        if (prode != 0) {
            Produto.findByPk(prode).then(prod => {
                if (prod.gradeId != 0) {
                    Grade.findOne({ where: { id: prod.gradeId } }).then(grade => {
                        G_coluna.findAll({ where: { gradeId: grade.id } }).then(colunas => {
                            G_linha.findAll({ where: { gradeId: grade.id } }).then(linhas => {
                                Estoque.findAll({ where: { produtoId: prod.id } }).then(estoques => {
                                    res.render("admin/estoque/adicao", { produtos: produtos, prod: prod, grade: grade, colunas: colunas, linhas: linhas, estoques: estoques })
                                })
                            })
                        })
                    })
                } else {
                    var grade = 0
                    var colunas = 0
                    var linhas = 0
                    var estoques = 0
                    res.render("admin/estoque/adicao", { produtos: produtos, prod: prod, grade: grade, colunas: colunas, linhas: linhas, estoques: estoques })
                }
            })
        } else {
            var prod = 0
            var grade = 0
            var colunas = 0
            var linhas = 0
            var estoques = 0
            res.render("admin/estoque/adicao", { produtos: produtos, prod: prod, grade: grade, colunas: colunas, linhas: linhas, estoques: estoques })
        }
    })
})

router.post("/estoque/acerto", (req, res) => {
    prodi = req.body.prodId
    refcoluna = req.body.coluna
    console.log("refcoluna: " + refcoluna)
    reflinha = req.body.linha
    console.log("reflinha: " + reflinha)
    quant = req.body.adicao
    status = req.body.status
    quantidade = parseInt(quant)
    produtoId = parseInt(prodi)
    Produto.findByPk(produtoId).then(prod => {
        if (prod.gradeId != 0) {
            Estoque.findOne({ where: { produtoId: produtoId, refcoluna: refcoluna, reflinha: reflinha } }).then(estoque => {
                if (estoque == undefined) {
                    Estoque.create({
                        produtoId: produtoId,
                        refcoluna: refcoluna,
                        reflinha: reflinha,
                        quantidade: quantidade,
                        status: status
                    }).then(estoquer => {
                        Produto.findByPk(produtoId).then(produto => {
                            var total = produto.totEstoque + estoquer.quantidade
                            Produto.update({
                                totEstoque: total
                            }, { where: { id: produtoId } }).then(() => {
                                res.redirect("/admin/estoques/" + 0)
                            })
                        })
                    })
                } else {
                    var tot = estoque.quantidade + quantidade
                    Estoque.update({
                        quantidade: tot,
                        status: status
                    }, { where: { id: estoque.id } }).then(() => {
                        Produto.findByPk(produtoId).then(produto => {
                            total = produto.totEstoque + quantidade
                            Produto.update({
                                totEstoque: total
                            }, { where: { id: produtoId } }).then(() => {
                                res.redirect("/admin/estoques/" + 0)
                            })
                        })
                    })
                }
            })
        } else {
            total = prod.totEstoque + quantidade
            Produto.update({
                totEstoque: total
            }, { where: { id: produtoId } }).then(() => {
                res.redirect("/admin/estoques/" + 0)
            })
        }
    })

})

router.get("/admin/estoque/estgrade/:prod", (req, res) => {
    var prod = req.params.prod
    Produto.findAll({ where: { gradeId: { [Op.ne]: 0 } } }).then(produtos => {
        if (prod != 0) {
            Produto.findByPk(prod).then(prod => {
                if (prod.gradeId != 0) {
                    Grade.findOne({ where: { id: prod.gradeId } }).then(grade => {
                        G_coluna.findAll({ where: { gradeId: grade.id } }).then(colunas => {
                            G_linha.findAll({ where: { gradeId: grade.id } }).then(linhas => {
                                Estoque.findAll({ where: { produtoId: prod.id } }).then(estoques => {
                                    res.render("admin/estoque/estgrade", { produtos: produtos, prod: prod, grade: grade, colunas: colunas, linhas: linhas, estoques: estoques })
                                })
                            })
                        })
                    })
                } else {
                    var grade = 0
                    var colunas = 0
                    var linhas = 0
                    var estoques = 0
                    res.render("admin/estoque/estgrade", { produtos: produtos, prod: prod, grade: grade, colunas: colunas, linhas: linhas, estoques: estoques })
                }
            })
        } else {
            var grade = 0
            var colunas = 0
            var linhas = 0
            var estoques = 0
            res.render("admin/estoque/estgrade", { produtos: produtos, prod: prod, grade: grade, colunas: colunas, linhas: linhas, estoques: estoques })
        }
    })
})

router.post("/estoque/editar", async (req, res) => {
    var estoquesIds = req.body.estoquesId
    var erro = []
    if (estoquesIds != undefined) {
        var estoques = await Estoque.findAll({ where: { id: { [Op.in]: estoquesIds } } })
        estoques.forEach(async estoque => {

            if (estoque.status == true) {
                var status = false 
            } else {
                var status = true 
            }

            try {
                Estoque.update({
                    status: status
                }, { where: { id: estoque.id } })
            } catch (error) {
                console.log(error)
                erro.push(error)
            }
        });
        if (erro.length > 0) {
            res.json({ erro: erro })
        } else {
            res.json({ resp: "Atualizações realizada com sucesso" })
        }
    } else {
        res.json({ erro: "Não foi realizado nenhuma alteração" })
    }
})

module.exports = router