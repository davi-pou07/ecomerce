const express = require('express')
const router = express.Router()
const Categoria = require("../DataBases/Categoria")
const Sequelize = require('sequelize')

//Novo
router.get("/admin/categoria/novo", (req, res) => {
    res.render("admin/categoria/novo")
})

router.post("/categorias/salvar", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    var status = req.body.status
    var destaque = req.body.destaque
    console.log(titulo)
    Categoria.create({
        titulo: titulo,
        descricao: descricao,
        status: status,
        destaque: destaque
    }).then(() => {
        res.redirect("/admin/categoria/novo")
    })
})

//Listar

router.get("/admin/categorias",(req,res)=>{
    Categoria.findAll({order:[
        ["id","asc"]
    ]}).then(categorias=>{
        res.render('admin/categoria/index',{categorias:categorias})
    })
})

router.post("/categoria/find",(req,res)=>{
    op = Sequelize.Op
    busca = `%${req.body.busca}`
    Categoria.findAll({where:{titulo:{[op.substring]:busca}}}).then(categorias =>{
        res.send(categorias)
    })
})

//Editar
router.get("/admin/categoria/editar/:categoriaId",(req,res)=>{
    var categoriaId = req.params.categoriaId
    Categoria.findByPk(categoriaId).then(categoria =>{
        res.render("admin/categoria/editar",{categoria:categoria})
    })
})
router.post("/categoria/editar",(req,res)=>{
    var categoriaId = req.body.categoriaId
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    var status = req.body.status
    var destaque = req.body.destaque
    if(categoriaId != undefined){
        if(!isNaN(categoriaId)){
            Categoria.update({
                titulo:titulo,
                descricao:descricao,
                status:status,
                destaque:destaque
            },{where:{id:categoriaId}}).then(()=>{
                res.redirect("/admin/categorias")
            })
        }else{
            res.redirect("/erro")  
        }
    }else{
        res.redirect("/erro")
    }
})

//Teste
router.get("/teste/valida",(req,res)=>{res.render("admin/categoria/teste")})
router.post("/teste",(req,res)=>{
    var val1 = req.body.teste1
    console.log(val1)
})

module.exports = router