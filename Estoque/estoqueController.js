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
const auth = require("../middlewares/adminAuth")


router.get("/admin/estoque/estgrade/:prod",auth, (req, res) => {
    var prod = req.params.prod
    Produto.findAll({ where: { gradeId: { [Op.ne]: 0 },status:true } }).then(produtos => {
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

router.post("/estoque/editar",auth, async (req, res) => {
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