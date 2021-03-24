const express = require("express")
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')
const Estoque = require("../DataBases/Estoque")
const Produto = require("../DataBases/Produto")

// router.get("/admin/estoques", (req, res) => {
//     var prod = 0
//     Produto.findAll().then(produtos => {
//         res.render("admin/estoque/acerto", { produtos: produtos, prod: prod })
//     })
// })
router.get("/admin/estoques/:produto", (req, res) => {
    var prod = req.params.produto

    Produto.findAll().then(produtos => {
        if (prod != 0) {
            Produto.findByPk(prod).then(prod => {
                Grade.findOne({ where: { id: prod.gradeId } }).then(grade => {
                    G_coluna.findOne({ where: { gradeId: grade.id } }).then(coluna=> {
                        res.render("admin/estoque/acerto", { produtos: produtos, prod: prod, grade: grade,coluna:coluna })
                    })
                })
            })
        } else {
            var grade = 0
            var coluna = 0
            res.render("admin/estoque/acerto", { produtos: produtos, prod: prod, grade: grade,coluna:coluna })
        }
    })
})

// router.post("/estoque/salvar",(req,res)=>{
//     var codProd = req.body.codProd
//     var coluna = req.body.coluna
//     var linha = req.body.linha
//     var quantidade = req.body.quantidade

//     Estoque.create({
//         codProd:codProd,
//         quantidade:quantidade,
//         coluna:coluna,
//         linha:linha
//     }).then(()=>{
//         res.redirect("/")
//     })
// })

module.exports = router