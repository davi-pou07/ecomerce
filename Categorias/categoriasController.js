const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const Categoria = require("../DataBases/Categoria")
const { json } = require('sequelize')
const auth = require("../middlewares/adminAuth")


//Novo
router.get("/admin/categoria/novo",auth, (req, res) => {
    res.render("admin/categoria/novo")
})

router.post("/categorias/salvar",auth, (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    var status = req.body.status
    var destaque = req.body.destaque
    Categoria.create({
        titulo: titulo,
        descricao: descricao,
        status: status,
        destaque: destaque
    }).then(() => {
        res.redirect("/admin/categorias")
    })
})

//Listar
//ORDEM QUE VAI APARECER PARA CLIENTE
router.get("/admin/categorias",auth, (req, res) => {
    Categoria.findAll({
        order: [
            ["id", "asc"]
        ]
    }).then(categorias => {
        res.render('admin/categoria/index', { categorias: categorias })
    })
})

//Buscar
//Maiuscula minuscula
/*
router.post("/categoria/find",auth, (req, res) => {
    op = Sequelize.Op
    buscar = `%${req.body.busca}`
    Categoria.findAll({ where: { titulo: { [op.substring]: buscar } } }).then(categorias => {
        var busca = []
        categorias.forEach(categoria => {
            busca.push(categoria.id)
        })
        x = busca[0]
        for(i =1;i<busca.length;i++){
            x = x+'-'+busca[i]
        }
        y = x.toString()
        res.redirect("/admin/categoria/busca/"+y)
    })
})
router.get("/admin/categoria/busca/:busca",auth,(req,res)=>{
    busca = req.params.busca
    buscar = busca.split('-')
    Categoria.findAll({where:{id:buscar}}).then(categorias =>{
        res.render("admin/categoria/busca",{categorias:categorias})
    })
})
*/

//Editar
router.get("/admin/categoria/editar/:categoriaId",auth, (req, res) => {
    var categoriaId = req.params.categoriaId
    Categoria.findByPk(categoriaId).then(categoria => {
        res.render("admin/categoria/editar", { categoria: categoria })
    })
})
router.post("/categoria/editar",auth, (req, res) => {
    var categoriaId = req.body.categoriaId
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    var status = req.body.status
    var destaque = req.body.destaque
    if (categoriaId != undefined) {
        if (!isNaN(categoriaId)) {
            Categoria.update({
                titulo: titulo,
                descricao: descricao,
                status: status,
                destaque: destaque
            }, { where: { id: categoriaId } }).then(() => {
                res.redirect("/admin/categorias")
            })
        } else {
            res.redirect("/erro")
        }
    } else {
        res.redirect("/erro")
    }
})

module.exports = router