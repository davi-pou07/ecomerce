const express = require('express')
const router = express()
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("../DataBases/database")
const queryInterface = sequelize.getQueryInterface();
const Produto = require("../DataBases/Produto")
const slugfy = require('slugify')


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

    queryInterface.removeColumn(
        'produtos',
        'materiald',
        {
            type: Sequelize.STRING,
            allowNull: true
        }
    ).then(() => {
        console.log("slug finalizado")
    res.send("Finalizado")
    })
    // var produtos =  await Produto.findAll()
    //     await produtos.forEach(produto => {
    //         Produto.update({
    //             slug:slugfy(produto.nome)
    //         },{where:{id:produto.id}})
    //     })

    //     res.send("Finalizado")

})




module.exports = router