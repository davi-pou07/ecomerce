const express = require('express')
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')
const { where } = require('sequelize')
const auth = require("../middlewares/adminAuth")


//Novo
router.get("/admin/grade/novo",auth, (req, res) => {
    res.render("admin/grade/novo")
})

router.post("/grade/salvar",auth, (req, res) => {
    var descricao = req.body.descricao
    var linha = req.body.linha
    var coluna = req.body.coluna
    var status = req.body.status

    var countl = req.body.countl
    var countc = req.body.countc
    console.log(countc)
    console.log(countl)

    Grade.create({
        descricao: descricao,
        status: status,
        linha: linha,
        coluna: coluna
    }).then(grade => {
        for (var y = 1; y <= countl; y++) {
            if (eval(`l${y} = req.body.l${y}`) != '') {
                G_linha.create({
                    gradeId: grade.id,
                    linha: eval(`l${y} = req.body.l${y}`)
                })
            }
        }
        for (var y = 1; y <= countc; y++) {
            if (eval(`c${y} = req.body.c${y}`) != '') {
                G_coluna.create({
                    gradeId: grade.id,
                    coluna: eval(`c${y} = req.body.c${y}`)
                })
            }
        }
        res.redirect("/admin/grades")
    })
})

//Listar

router.get("/admin/grades",auth, (req, res) => {
    Grade.findAll({
        order: [
            ["id", "asc"]
        ]
    }).then(grades => {
        res.render("admin/grade/index", { grades: grades })
    })
})

//Buscar
//Maiuscula minuscula
router.post("/gradeS/find",auth, (req, res) => {
    op = Sequelize.Op
    buscar = `%${req.body.busca}`
    //INICIA COM E MAIUSCUO MINUSCULO
    Grade.findAll({ where: { descricao: { [op.substring]: buscar } } }).then(grades => {
        var busca = []
        grades.forEach(grade => {
            busca.push(grade.id)
        })
        x = busca[0]
        for (i = 1; i < busca.length; i++) {
            x = x + '-' + busca[i]
        }
        y = x.toString()
        res.redirect("/admin/grade/busca/" + y)
    })
})
router.get("/admin/grade/busca/:busca",auth, (req, res) => {
    busca = req.params.busca
    buscar = busca.split('-')
    Grade.findAll({ where: { id: buscar } }).then(grades => {
        res.render("admin/grade/busca", { grades: grades })
    })
})


//Editar
router.get("/admin/grade/editar/:gradeId",auth, (req, res) => {
    var gradeId = req.params.gradeId
    Grade.findByPk(gradeId).then(grade => {
        G_coluna.findAll({ where: { gradeId: grade.id }, raw: true,order: [['id','asc']] }).then(colunas => {
            G_linha.findAll({ where: { gradeId: grade.id }, raw: true,order: [['id','asc']] }).then(linhas => {
                res.render("admin/grade/editar", { grade: grade, colunas: colunas, linhas: linhas })
            })
        })
    })
})
router.post("/grade/editar",auth, (req, res) => {
    var gradeId = req.body.gradeId
    var descricao = req.body.descricao
    var linha = req.body.linha
    var coluna = req.body.coluna
    var status = req.body.status

    var countc = req.body.countc
    
    var countl = req.body.countl
    var contagemc = req.body.contagemc
    var contageml = req.body.contageml

    // res.json(req.body)
    //ID das existentes
    //inexistentes criar uma nova

    Grade.findByPk(gradeId).then(grade => {
        if (grade != undefined) {
            Grade.update({
                descricao: descricao,
                linha: linha,
                coluna: coluna,
                status: status
            }, { where: { id: grade.id } }).then(prox => {
                if (contageml != "") {
                    var contadorL = parseInt(contageml)
                } else {
                    var contadorL = parseInt(countl)
                }
                for (var x = 1; x <= contadorL; x++) {
                    var y =1 
                    G_linha.findOne({ where: { id: eval(`lid${x} = req.body.lid${x}`), gradeId: grade.id } }).then(glinha => {
                            if (glinha != undefined) {
                                G_linha.update({
                                    linha: eval(`l${y} = req.body.l${y}`)
                                }, { where: { id: glinha.id } })
                            } else {
                                if (eval(`l${y} = req.body.l${y}`) != '') {
                                    G_linha.create({
                                        gradeId: gradeId,
                                        linha: eval(`l${y} = req.body.l${y}`)
                                    })
                                }
                            }
                        y++
                    })
                }

                if (contagemc != "") {
                    var contadorC = parseInt(contagemc)
                } else {
                    var contadorC = parseInt(countc)
                }
                for (var z = 1; z <= contadorC; z++) {
                    var k = 1; 
                    G_coluna.findOne({ where: { id: eval(`cid${z} = req.body.cid${z}`), gradeId: grade.id } }).then(gcoluna => {
                            if (gcoluna != undefined) {
                                G_coluna.update({
                                    coluna: eval(`c${k} = req.body.c${k}`)
                                }, { where: { id: gcoluna.id } })
                            } else {
                                if (eval(`c${k} = req.body.c${k}`) != '') {
                                    G_coluna.create({
                                        gradeId: gradeId,
                                        coluna: eval(`c${k} = req.body.c${k}`)
                                    })
                                }
                            }
                        k++
                    })
                }
            }).catch(err => {
                res.json({ err: err, resp: "Não fossivel alterar a grade" })
            })
            res.redirect("/admin/grades")
        } else {
            res.json("Grade não encontrada")
        }
    })
})



module.exports = router