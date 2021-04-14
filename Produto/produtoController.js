const express = require('express')
const multer = require('multer')
const path = require('path')
const fs =  require('fs')

const router = express.Router()
const Grade = require("../DataBases/Grade")
const Categoria = require("../DataBases/Categoria")
const Estoque = require("../DataBases/Estoque")
const Sequelize = require('sequelize')
const Produto = require('../DataBases/Produto')
const Preco = require('../DataBases/Preco')
const Imagem = require("../DataBases/Imagen")
const { count } = require('console')
const { where } = require('sequelize')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/uploads/')
    },
    filename: function (req, file, cb) {
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
        }).then(preco => {
            files.forEach(file => {
                destination = file.destination
                dest = destination.replace("public/", "")
                Imagem.create({
                    filename: file.filename,
                    destination: dest,
                    produtoId: produto.id
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
                            Imagem.findAll({ where: { produtoId: produtoId } }).then(imagens => {
                                res.render("admin/produto/edit", { produto: produto, categorias: categorias, preco: preco, grades: grades, imagens: imagens })
                            }).catch(err => {
                                res.send("Sem imagens cadastradas")
                            })
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

router.post("/produto/editar", upload.any('img'), (req, res) => {
    var imm = []
    files = req.files
    var prodId = req.body.produtoId
    var nome = req.body.nome
    var descricao = req.body.descricao
    var status = req.body.status
    var categoriaId = req.body.categoriaId
    var gradeId = req.body.gradeId

    var venda = req.body.venda
    var custo = req.body.custo
    var desconto = req.body.desconto

    // Imagem.findAll({where:{produtoId:prodId}}).then(imagens =>{
    //     count = 1
    //     imagens.forEach(()=>{
    //         count ++
    //     })
    //     console.log(imagens)
    //     console.log("__________________")
    // })
    
    Produto.update({
        nome: nome,
        descricao: descricao,
        status: status,
        categoriaId: categoriaId,
        gradeId: gradeId
    },{where:{id:prodId}}).then(produto => {
        Preco.update({
            venda: venda,
            custo: custo,
            desconto: desconto,
        },{where:{produtoId:prodId}}).then(preco => {
            files.forEach(file => {
                destination = file.destination
                dest = destination.replace("public/", "")
                Imagem.create({
                    filename: file.filename,
                    destination: dest,
                    produtoId: prodId
                })
            })
            Imagem.findAndCountAll({where:{produtoId:prodId}}).then(imagens =>{
                for(var i = 1;i<=imagens.count;i++){
                    eval(`img${i} = req.body.img${i}`)
                        
                        
                }
                
            })
            res.redirect("/admin/produtos")
        })
    })
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