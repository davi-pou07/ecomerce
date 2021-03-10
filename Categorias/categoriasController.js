const express = require('express')
const router = express.Router()
const Categoria = require("../DataBases/Categoria")

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
    Categoria.findAll({where:{status:true}}).then(categorias=>{
        res.render('admin/categoria/index',{categorias:categorias})
    })
})


//Teste
router.get("/teste/valida",(req,res)=>{res.render("admin/categoria/teste")})
router.post("/teste",(req,res)=>{
    var val1 = req.body.teste1
    console.log(val1)
})

module.exports = router