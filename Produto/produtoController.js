const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const auth = require("../middlewares/adminAuth")


const router = express.Router()
const Grade = require("../DataBases/Grade")
const Categoria = require("../DataBases/Categoria")
const Estoque = require("../DataBases/Estoque")
const Sequelize = require('sequelize')
const Produto = require('../DataBases/Produto')
const Preco = require('../DataBases/Preco')
const Imagem = require("../DataBases/Imagen")
const Marca = require("../DataBases/Marca")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Material = require('../DataBases/Material')

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


router.get("/admin/produto/novo",auth, (req, res) => {
    Categoria.findAll().then(categorias => {
        Grade.findAll().then(async grades => {
            var marcas = await Marca.findAll()
            var materiais = await Material.findAll()
            res.render("admin/produto/novo", { categorias: categorias, grades: grades, marcas: marcas,materiais:materiais })
        })
    })
})

router.post("/produto/novo",auth, (req, res) => {

    var count = req.body.count

    var nome = req.body.nome
    var descricao = req.body.descricao
    var status = req.body.status
    var categoriaId = req.body.categoriaId
    var gradeId = req.body.gradeId
    var marcaId = req.body.marcaId
    var materialId = req.body.materialId
    

    var venda = req.body.venda
    var custo = req.body.custo
    var desconto = req.body.desconto

    venda = (venda == '' || venda == undefined)?0:venda
    custo = (custo == '' || custo == undefined)?0:custo
    desconto = (desconto == '' || desconto == undefined)?0:desconto

    if(venda.toString().includes(",")){
        venda = parseFloat(venda.toString().replace(/\./g,"").replace(",","."))
    }
    if(custo.toString().includes(",")){
        custo = parseFloat(custo.toString().replace(/\./g,"").replace(",","."))
    }
    if(desconto.toString().includes(",")){
        desconto = parseFloat(desconto.toString().replace(/\./g,"").replace(",","."))
    }

    if(venda.toString().includes(",")){
        venda = parseFloat(venda.toString().replace(/\./g,"").replace(",","."))
    }
    if(custo.toString().includes(",")){
        custo = parseFloat(custo.toString().replace(/\./g,"").replace(",","."))
    }
    if(desconto.toString().includes(",")){
        desconto = parseFloat(desconto.toString().replace(/\./g,"").replace(",","."))
    }
  
    Produto.create({
        nome: nome,
        descricao: descricao,
        status: status,
        categoriaId: categoriaId,
        gradeId: gradeId,
        marcaId: marcaId,
        materialId: materialId
    }).then(produto => {
        Preco.create({
            venda: venda,
            custo: custo,
            desconto: desconto,
            produtoId: produto.id
        }).then(async preco => {
            for (var y = 1; y <= count; y++) {
                Imagem.create({
                    imagem: eval(`a${y} = req.body.a${y}`),
                    produtoId: produto.id
                })
            }
            if (gradeId != 0) {
                var grade = await Grade.findByPk(gradeId)

                var glinha = await G_linha.findAll({ where: { gradeId: grade.id } })
                var gcoluna = await G_coluna.findAll({ where: { gradeId: grade.id } })

                for (var a = 0; a < glinha.length; a++) {
                    for (var b = 0; b < gcoluna.length; b++) {
                        Estoque.create({
                            produtoId: produto.id,
                            refcoluna: gcoluna[b].id,
                            reflinha: glinha[a].id,
                            status: true
                        }).then(estoque => {
                            console.log(estoque)
                        })
                    }
                }
            }
            res.redirect("/admin/produtos")
        })
    })
})

//Listar
router.get("/admin/produtos",auth, (req, res) => {
    Produto.findAll({ order: [['id', 'asc']] }).then(produtos => {
        console.log(produtos)
        Preco.findAll().then(precos => {
            res.render("admin/produto/index", { produtos: produtos, precos: precos })
        })
    })
})

//Editar
router.get("/admin/produto/editar/:produtoId",auth, (req, res) => {
    var produtoId = req.params.produtoId
    if (produtoId != undefined) {
        if (!isNaN(produtoId)) {
            Produto.findByPk(produtoId).then(produto => {
                //valid
                Categoria.findAll().then(categorias => {
                    Preco.findOne({ where: { produtoId: produtoId } }).then(preco => {
                        Grade.findAll().then(grades => {
                            Imagem.findAll({ where: { produtoId: produtoId } }).then(async imagens => {
                                var marcas = await Marca.findAll()
                                var materiais = await Material.findAll()
                                res.render("admin/produto/edit", { produto: produto, categorias: categorias, preco: preco, grades: grades, imagens: imagens, marcas: marcas,materiais:materiais })
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

router.post("/produto/editar",auth, async (req, res) => {
    var count = req.body.count

    var prodId = req.body.produtoId
    var nome = req.body.nome
    var descricao = req.body.descricao
    var status = req.body.status
    var categoriaId = req.body.categoriaId
    var gradeId = req.body.gradeId
    var marcaId = req.body.marcaId
    var materialId = req.body.materialId

    var produto = await Produto.findByPk(prodId)
    if (gradeId != 0) {
        if (produto.gradeId != 0) {
            gradeId == produto.gradeId
        }
    }

    var vendaBr = req.body.venda
    var custoBr = req.body.custo
    var descontoBr = req.body.desconto

    vendaBr = (vendaBr == '' || vendaBr == undefined)?0:vendaBr
    custoBr = (custoBr == '' || custoBr == undefined)?0:custoBr
    descontoBr = (descontoBr == '' || descontoBr == undefined)?0:descontoBr

    if(vendaBr.toString().includes(",")){
        vendaBr = parseFloat(vendaBr.toString().replace(/\./g,"").replace(",","."))
    }
    if(custoBr.toString().includes(",")){
        custoBr = parseFloat(custoBr.toString().replace(/\./g,"").replace(",","."))
    }
    if(descontoBr.toString().includes(",")){
        descontoBr = parseFloat(descontoBr.toString().replace(/\./g,"").replace(",","."))
    }

    Produto.update({
        nome: nome,
        descricao: descricao,
        status: status,
        categoriaId: categoriaId,
        gradeId: gradeId,
        marcaId: marcaId,
        materialId:materialId
    }, { where: { id: produto.id } }).then(prod => {
        Preco.update({
            venda: vendaBr,
            custo: custoBr,
            desconto: descontoBr,
        }, { where: { produtoId: prodId } }).then(preco => {
            Imagem.findAll({ where: { produtoId: prodId } }).then(imagens => {
                for (var i = 1; i <= imagens.length; i++) {
                    eval(`img${i} = req.body.img${i}`)
                    if (eval(`img${i}`) != undefined) {
                        Imagem.findOne({ where: { id: eval(`img${i}`) } }).then(img => {
                            Imagem.destroy({ where: { id: img.id } }).then(() => { })
                        })
                    }
                }
            }).then(async img => {
                for (var y = 1; y <= count; y++) {
                    Imagem.create({
                        imagem: eval(`a${y} = req.body.a${y}`),
                        produtoId: prodId
                    })
                }
               

                if (produto.gradeId == 0 && gradeId != 0) {
                    var grade = await Grade.findByPk(gradeId)
                    var glinha = await G_linha.findAll({ where: { gradeId: grade.id } })
                    var gcoluna = await G_coluna.findAll({ where: { gradeId: grade.id } })

                    for (var a = 0; a < glinha.length; a++) {
                        for (var b = 0; b < gcoluna.length; b++) {
                            Estoque.create({
                                produtoId: produto.id,
                                refcoluna: gcoluna[b].id,
                                reflinha: glinha[a].id,
                                status: true
                            }).then(estoque => {
                                console.log(estoque)
                            })
                        }
                    }
                }
                res.redirect("/admin/produtos")
            }).catch(err => {
                res.json({ Resp: err })
            })
        }).catch(err => {
            res.json({ Resp: err })
        })
    }).catch(err => {
        res.json({ Resp: err })
    })
})

//Axios 

//ALINHAR AXIOS COM BACK
router.post("/find",auth, (req, res) => {
    op = Sequelize.Op
    buscar = `%${req.body.busca}`
    console.log(buscar)
    Produto.findAll({ where: { nome: { [op.substring]: buscar } } }).then(produtos => {
        if (produtos != undefined) {
            var busca = []
            produtos.forEach(produto => {
                busca.push(produto.id)
            })
            x = busca[0]
            for (i = 1; i < busca.length; i++) {
                x = x + '-' + busca[i]
            }
            y = x.toString()
            res.json(y)
        } else {
            res.json(produtos)
        }

    })
})
/*
router.post("/produtos/find",auth, (req, res) => {
    op = Sequelize.Op
    buscar = `%${req.body.busca}`
    console.log(buscar)
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

router.get("/admin/produto/busca/:busca",auth, (req, res) => {
    busca = req.params.busca
    buscar = busca.split('-')
    Produto.findAll({ where: { id: buscar } }).then(produtos => {
        Preco.findAll().then(precos => {
            res.render("admin/produto/find", { produtos: produtos, precos: precos })
        })
    })
})
*/

module.exports = router