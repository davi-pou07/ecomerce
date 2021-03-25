const express = require("express")
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')
const Estoque = require("../DataBases/Estoque")
const Produto = require("../DataBases/Produto")
const { where } = require("sequelize")

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
                    G_coluna.findOne({ where: { gradeId: grade.id } }).then(coluna => {
                        G_linha.findOne({ where: { gradeId: grade.id } }).then(linha => {
                            Estoque.findAll({ where: { produtoId: prod.id } }).then(estoques => {
                                res.render("admin/estoque/acerto", { produtos: produtos, prod: prod, grade: grade, coluna: coluna, linha: linha, estoques:estoques })
                            })
                        })
                    })
                })
            })
        } else {
            var grade = 0
            var coluna = 0
            var linha = 0
            var estoques = 0
            res.render("admin/estoque/acerto", { produtos: produtos, prod: prod, grade: grade, coluna: coluna, linha: linha, estoques:estoques })
        }
    })
})

router.post("/estoque/acerto",(req,res)=>{
    prodi = req.body.prodId
    coluna =  req.body.coluna
    linha = req.body.linha
    quant = req.body.adicao
    quantidade = parseInt(quant)
    produtoId = parseInt(prodi)
    Estoque.findOne({where:{produtoId:produtoId,coluna:coluna,linha:linha}}).then(estoque =>{
        if(estoque == undefined){
            Estoque.create({
                produtoId:produtoId,
                coluna:coluna,
                linha:linha,
                quantidade:quantidade
            }).then(estoquer =>{
                Produto.findByPk(produtoId).then(produto=>{
                    var total = produto.totEstoque + estoquer.quantidade
                    Produto.update({
                        totEstoque:total
                    },{where:{id:produtoId}}).then(()=>{
                        res.send("CRIADO UM NOVO")
                    })
                })
            })
        }else{
            Estoque.update({
                quantidade:quantidade
            },{where:{id:estoque.id}}).then(() =>{
                Produto.findByPk(produtoId).then(produto=>{
                    total = produto.totEstoque +  quantidade
                    Produto.update({
                        totEstoque:total
                    },{where:{id:produtoId}}).then(()=>{
                        res.send("UPDATADO")
                    })
                })
            })
        }
    })
})

module.exports = router