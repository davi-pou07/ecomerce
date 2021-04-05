const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()
const Grade = require("../DataBases/Grade")
const Categoria = require("../DataBases/Categoria")
const Estoque = require("../DataBases/Estoque")
const Sequelize = require('sequelize')
const Produto = require('../DataBases/Produto')
const Preco = require('../DataBases/Preco')
const Imagem = require("../DataBases/Imagen")


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/img/uploads/')
    },
    filename: function(req,file,cb){
        var nome = req.body.nome
        var chara = nome.split(' ')[0]
        cb(null, chara + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })


router.get("/admin/produto/novo", (req, res) => {
    Categoria.findAll().then(categorias => {
        Grade.findAll().then(grades => {
            res.render("admin/produto/novo", { categorias: categorias, grades: grades })
        })
    })
})

router.post("/produto/novo", upload.any('img'), (req, res) => {

    files = req.files
    files.forEach(file =>{
        destination = file.destination
        des = destination.replace("public/","")
        console.log("------------------------")
        console.log(des + file.filename)
        console.log("------------------------")
    })

    console.log(req.body, req.files)

    var nome = req.body.nome
    var descricao = req.body.descricao
    var status = req.body.status
    var categoriaId = req.body.categoriaId
    var gradeId = req.body.gradeId

    var venda = req.body.venda
    var custo = req.body.custo
    var desconto = req.body.desconto


    Produto.create({
        nome: nome,
        descricao: descricao,
        status: status,
        categoriaId: categoriaId,
        gradeId: gradeId
    }).then(produto => {
        Preco.create({
            venda: venda,
            custo: custo,
            desconto: desconto,
            produtoId: produto.id
        }).then(produto => {
            files.forEach(file =>{
                destination = file.destination
                dest = destination.replace("public/","")
                Imagem.create({
                    filename:file.filename,
                    destination:dest,
                    produtoId:produto.id
                })
            })
            res.redirect("/admin/produtos")
        })
    })
})

//Listar
router.get("/admin/produtos", (req, res) => {
    Produto.findAll().then(produtos => {
        Preco.findAll().then(precos => {
            res.render("admin/produto/index", { produtos: produtos, precos: precos })
        })
    })
})

//Editar
router.get("/admin/produto/editar/:produtoId", (req, res) => {
    var produtoId = req.params.produtoId
    if (produtoId != undefined) {
        if (!isNaN(produtoId)) {
            Produto.findByPk(produtoId).then(produto => {
                //valid
                Categoria.findAll().then(categorias => {
                    Preco.findOne({ where: { produtoId: produtoId } }).then(preco => {
                        Grade.findAll().then(grades => {
                            res.render("admin/produto/edit", { produto: produto, categorias: categorias, preco: preco, grades: grades })
                        }).catch(err => {
                            res.send("Sem grades cadastradas")
                        })
                    }).catch(err => {
                        res.send("Preços não cadastrado")
                    })
                }).catch(err => {
                    res.send("Categoria não encontrada")
                })
            }).catch(err => {
                res.send("Produto não encontrado")
            })
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("/")
    }
})


router.post("/produtos/find", (req, res) => {
    op = Sequelize.Op
    buscar = `%${req.body.busca}`
    Produto.findAll({ where: { nome: { [op.substring]: buscar } } }).then(produtos => {
        var busca = []
        produtos.forEach(produto => {
            busca.push(produto.id)
        })
        x = busca[0]
        for (i = 1; i < busca.length; i++) {
            x = x + '-' + busca[i]
        }
        y = x.toString()
        res.redirect("/admin/produto/busca/" + y)
    })
})

router.get("/admin/produto/busca/:busca", (req, res) => {
    busca = req.params.busca
    buscar = busca.split('-')
    Produto.findAll({ where: { id: buscar } }).then(produtos => {
        Preco.findAll().then(precos => {
            res.render("admin/produto/find", { produtos: produtos, precos: precos })
        })
    })
})
module.exports = router