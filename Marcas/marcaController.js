const express = require('express')
const router = express.Router()
const Marcas = require("../DataBases/Marca")
const Sequelize = require('sequelize')

router.post("/marca/salvar",(req,res)=>{
    var marca = req.body.nomeMarca
    if (marca != undefined && marca != '') {
        Marcas.create({
            marca:marca
        }).then(marca =>{
            res.json({marca:marca})
        }).catch(erro =>{
            res.json({erro:erro})
        })
    } else {
        res.json({erro:"Marca invalida"})
    }
})

module.exports = router