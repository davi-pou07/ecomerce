const express = require('express')
const router = express.Router()
const Marcas = require("../DataBases/Marca")
const Sequelize = require('sequelize')
const auth = require("../middlewares/adminAuth")

router.post("/marca/salvar",auth,async(req,res)=>{
    var marca = req.body.nomeMarca
    if (marca != undefined && marca != '') {
        var exist =await Marcas.findOne({where:{marca:marca}})
        if(exist == undefined){
            Marcas.create({
                marca:marca
            }).then(marca =>{
                res.json({marca:marca})
            }).catch(erro =>{
                res.json({erro:erro})
            })
        }else{
            res.json({erro:"Marca ja cadastrada"})
        }
    } else {
        res.json({erro:"Marca invalida"})
    }
})

module.exports = router