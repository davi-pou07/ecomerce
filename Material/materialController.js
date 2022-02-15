const express = require('express')
const router = express.Router()
const Material = require("../DataBases/Material")
const Sequelize = require('sequelize')
const auth = require("../middlewares/adminAuth")

router.post("/material/salvar",auth,async(req,res)=>{
    var material = req.body.nomeMaterial
    if (material != undefined && material != '') {
        var exist =await Material.findOne({where:{material:material}})
        if(exist == undefined){
            Material.create({
                material:material
            }).then(material =>{
                res.json({material:material})
            }).catch(erro =>{
                res.json({erro:erro})
            })
        }else{
            res.json({erro:"Material ja cadastrado"})
        }
    } else {
        res.json({erro:"Material invalido"})
    }
})

module.exports = router