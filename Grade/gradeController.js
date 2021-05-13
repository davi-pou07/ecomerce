const express = require('express')
const router = express.Router()
const Grade = require("../DataBases/Grade")
const G_linha = require("../DataBases/G_linha")
const G_coluna = require("../DataBases/G_coluna")
const Sequelize = require('sequelize')
const { where } = require('sequelize')

//Novo
router.get("/admin/grade/novo", (req, res) => {
    res.render("admin/grade/novo")
})

router.post("/grade/salvar", (req, res) => {
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

router.get("/admin/grades", (req, res) => {
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
router.post("/gradeS/find", (req, res) => {
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
router.get("/admin/grade/busca/:busca", (req, res) => {
    busca = req.params.busca
    buscar = busca.split('-')
    Grade.findAll({ where: { id: buscar } }).then(grades => {
        res.render("admin/grade/busca", { grades: grades })
    })
})


//Editar
router.get("/admin/grade/editar/:gradeId", (req, res) => {
    var gradeId = req.params.gradeId
    Grade.findByPk(gradeId).then(grade => {
        G_coluna.findAll({ where: { gradeId: grade.id }, raw: true }).then(colunas => {
            G_linha.findAll({ where: { gradeId: grade.id }, raw: true }).then(linhas => {
                res.render("admin/grade/editar", { grade: grade, colunas: colunas, linhas: linhas })
            })
        })
    })
})
router.post("/grade/editar", (req, res) => {
    var gradeId = req.body.gradeId
    var descricao = req.body.descricao
    var linha = req.body.linha
    var coluna = req.body.coluna
    var status = req.body.status
    var countc = req.body.countc
    var countl = req.body.countl
    //ID das existentes
    //inexistentes criar uma nova

    Grade.findByPk(gradeId).then(grade => {
        if (grade != undefined) {
            Grade.update({
                descricao: descricao,
                linha: linha,
                coluna: coluna,
                status: status
            }, { where: { id: grade.id } }).then(() => {
                for (var x = 1; x <= countl; x++) {
                    G_linha.findOne({ where: { id: eval(`lid${x} = req.body.lid${x}`) } }).then(glinha => {
                        if (glinha != undefined) {
                            G_linha.update({
                                linha: eval(`l${x} = req.body.l${x}`)
                            }, { where: { id: eval(`lid${x} = req.body.lid${x}`) } })
                        } else {
                            if (eval(`l${x} = req.body.l${x}`) != '') {
                                G_linha.create({
                                    gradeId: gradeId,
                                    linha: eval(`l${x} = req.body.l${x}`)
                                })
                            }
                        }
                    })
                }
                for (var x = 1; x <= countc; x++) {
                    G_coluna.findOne({ where: { id: eval(`cid${x} = req.body.cid${x}`) } }).then(gcoluna => {
                        if (gcoluna != undefined) {
                            G_coluna.update({
                                coluna: eval(`c${x} = req.body.c${x}`)
                            }, { where: { id: eval(`cid${x} = req.body.cid${x}`) } })
                        } else {
                            if (eval(`c${x} = req.body.c${x}`) != '') {
                                G_coluna.create({
                                    gradeId: gradeId,
                                    coluna: eval(`c${x} = req.body.c${x}`)
                                })
                            }
                        }
                    })
                }
            })
            res.redirect("/admin/grades")
        }
    })
})


//teste
router.post("/teste", (req, res) => {
    var teste = req.body.teste
    console.log("---------------------------------")
    console.log(teste + "                           |")
    console.log("---------------------------------")

})

module.exports = router