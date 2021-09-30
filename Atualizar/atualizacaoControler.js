const express = require('express')
const router = express()
const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require("../DataBases/database")
const queryInterface = sequelize.getQueryInterface();
const Produto = require("../DataBases/Produto")


// router.get("/atualizar/produto",(req,res)=>{
//     queryInterface.addColumn(
//         'produtos',
//         'marcaId',
//         {
//             type:Sequelize.INTEGER,
//             allowNull:true
//         }
//       ).then(()=>{
//           res.send("Finalizado")
//       })
// })




module.exports = router