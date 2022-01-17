const express = require('express')
const router = express()
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("../DataBases/database")
const queryInterface = sequelize.getQueryInterface();
const slugfy = require('slugify')
const DadosPagamentos = require("../DataBases/DadosPagamentos")


router.get("/atualizar/produto", async (req, res) => {
    // V1____

    // queryInterface.addColumn(
    //     'produtos',
    //     'marcaId',
    //     {
    //         type:Sequelize.INTEGER,
    //         allowNull:true
    //     }
    //   ).then(()=>{
    //       res.send("Finalizado")
    //   })

    // V2___
    // queryInterface.addColumn(
    //     'produtos',
    //     'materialId',
    //     {
    //         type: Sequelize.INTEGER,
    //         allowNull: true
    //     }
    // ).then(() => {
    //     console.log("materialId finalizado")
    // })

    // queryInterface.removeColumn(
    //     'produtos',
    //     'slug',
    //     {
    //         type: Sequelize.STRING,
    //         allowNull: true
    //     }
    // ).then(() => {
    //     console.log("slug finalizado")
    // res.send("Finalizado")
    // })
    // var produtos =  await Produto.findAll()
    //     await produtos.forEach(produto => {
    //         Produto.update({
    //             slug:slugfy(produto.nome)
    //         },{where:{id:produto.id}})
    //     })

    //     res.send("Finalizado")

})

router.get("/atualizaTabelas",async(req,res)=>{
    // queryInterface.addColumn(
    //   'dadosentregas',
    //   'valRecebido',
    //   {
    //       type:Sequelize.FLOAT,
    //       allowNull:true
    //   }
    // ).then(()=>{
    //     console.log("ok")
    // })

    // queryInterface.addColumn(
    //     'dadospagamentos',
    //     'valRecebido',
    //     {
    //         type:Sequelize.FLOAT,
    //         allowNull:true
    //     }
    //   ).then(()=>{
    //       res.send("Finalizado")
    //   })
    DadosPagamentos.update({valRecebido:parseFloat(0)},{where:{valRecebido:null}}).then(()=>{
        res.send("ok")
    })
    
})


module.exports = router