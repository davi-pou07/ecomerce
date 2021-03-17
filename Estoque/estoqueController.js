const express = require("express")
const router =  express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')
const Estoque = require("../DataBases/Estoque")

// router.get("/estoque/teste",(req,res)=>{
//     Grade.findOne().then(grade =>{
//         G_linha.findOne({where:{gradeId:grade.id}}).then(linha =>{
//             G_coluna.findOne({where:{gradeId:grade.id}}).then(coluna =>{
//                 res.render("admin/estoque/teste",{grade:grade,linha:linha,coluna:coluna})
//             })
//         })
//     })
// })

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