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

    var linha1 = req.body.linha1
    var linha2 = req.body.linha2
    var linha3 = req.body.linha3
    var linha4 = req.body.linha4
    var linha5 = req.body.linha5
    var linha6 = req.body.linha6
    var linha7 = req.body.linha7
    var linha8 = req.body.linha8
    var linha9 = req.body.linha9
    var linha10 = req.body.linha10

    var coluna1 = req.body.coluna1
    var coluna2 = req.body.coluna2
    var coluna3 = req.body.coluna3
    var coluna4 = req.body.coluna4
    var coluna5 = req.body.coluna5
    var coluna6 = req.body.coluna6
    var coluna7 = req.body.coluna7
    var coluna8 = req.body.coluna8
    var coluna9 = req.body.coluna9
    var coluna10 = req.body.coluna10
    
    Grade.create({
        descricao: descricao,
        status: status,
        linha:linha,
        coluna:coluna
    }).then(grade => {
        G_linha.create({
            gradeId:grade.id,
            linha1 : linha1,
            linha2 : linha2,
            linha3 : linha3,
            linha4 : linha4,
            linha5 : linha5,
            linha6 : linha6,
            linha7 : linha7,
            linha8 : linha8,
            linha9 : linha9,
            linha10 : linha10
        })
        G_coluna.create({
            gradeId:grade.id,
            coluna1 : coluna1,
            coluna2 : coluna2,
            coluna3 : coluna3,
            coluna4 : coluna4,
            coluna5 : coluna5,
            coluna6 : coluna6,
            coluna7 : coluna7,
            coluna8 : coluna8,
            coluna9 : coluna9,
            coluna10 : coluna10
        }).then(()=>{
            res.redirect("/admin/grades")
        })
    })
})

//Listar

router.get("/admin/grades",(req,res)=>{
    Grade.findAll({
        order:[
            ["id","asc"]
        ]
    }).then(grades =>{
        res.render("admin/grade/index",{grades:grades})
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
        for(i =1;i<busca.length;i++){
            x = x+'-'+busca[i]
        }
        y = x.toString()
        res.redirect("/admin/grade/busca/"+y)
    })
})
router.get("/admin/grade/busca/:busca",(req,res)=>{
    busca = req.params.busca
    buscar = busca.split('-')
    Grade.findAll({where:{id:buscar}}).then(grades =>{
        res.render("admin/grade/busca",{grades:grades})
    })
})


//Editar
router.get("/admin/grade/editar/:gradeId", (req, res) => {
    var gradeId = req.params.gradeId
    Grade.findByPk(gradeId).then(grade => {
        G_coluna.findOne({where:{gradeId:grade.id}, raw:true}).then(coluna =>{
            G_linha.findOne({where:{gradeId:grade.id},raw:true}).then(linha =>{
                res.render("admin/grade/editar", { grade: grade, coluna:coluna, linha:linha })
            })
        })
    })
})
router.post("/grade/editar", (req, res) => {
    var gradeId = req.body.gradeId
    var status = req.body.status

    var linha1 = req.body.linha1
    var linha2 = req.body.linha2
    var linha3 = req.body.linha3
    var linha4 = req.body.linha4
    var linha5 = req.body.linha5
    var linha6 = req.body.linha6
    var linha7 = req.body.linha7
    var linha8 = req.body.linha8
    var linha9 = req.body.linha9
    var linha10 = req.body.linha10

    var coluna1 = req.body.coluna1
    var coluna2 = req.body.coluna2
    var coluna3 = req.body.coluna3
    var coluna4 = req.body.coluna4
    var coluna5 = req.body.coluna5
    var coluna6 = req.body.coluna6
    var coluna7 = req.body.coluna7
    var coluna8 = req.body.coluna8
    var coluna9 = req.body.coluna9
    var coluna10 = req.body.coluna10
    
    Grade.update({
        status: status
    },{where:{id:gradeId}}).then(grade => {
        G_linha.update({
            linha1 : linha1,
            linha2 : linha2,
            linha3 : linha3,
            linha4 : linha4,
            linha5 : linha5,
            linha6 : linha6,
            linha7 : linha7,
            linha8 : linha8,
            linha9 : linha9,
            linha10 : linha10
        },{where:{gradeId:gradeId}})
        G_coluna.update({
            coluna1 : coluna1,
            coluna2 : coluna2,
            coluna3 : coluna3,
            coluna4 : coluna4,
            coluna5 : coluna5,
            coluna6 : coluna6,
            coluna7 : coluna7,
            coluna8 : coluna8,
            coluna9 : coluna9,
            coluna10 : coluna10
        },{where:{gradeId:gradeId}}).then(()=>{
            res.redirect("/admin/grades")
        })
    })
})


//teste
router.post("/teste",(req,res)=>{
    var teste = req.body.teste
console.log("---------------------------------")
console.log(teste+"                           |")
console.log("---------------------------------")

})

module.exports = router