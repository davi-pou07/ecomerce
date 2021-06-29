const express = require('express')
const router = express.Router()
const Empresa = require("../DataBases/Empresa")
const Sequelize = require('sequelize')
const moment = require('moment');
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { where } = require('sequelize');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/')
    },
    filename: function (req, file, cb) {
        cb(null, "logo" + path.extname(file.originalname))
    }
})
const upload = multer({ storage })



router.get("/admin/empresa/novo", (req, res) => {
    Empresa.findOne().then(empresa => {
        if (empresa == undefined) {
            res.render("admin/empresa/novo")
        } else {
            res.send("Ja existe uma empresa cadastrada:" + " " + empresa.nome)
        }
    })
})

router.post("/empresa/novo", (req, res) => {
    var nome = req.body.nome
    var cnpj = req.body.cnpj
    var inscriEstad = req.body.inscriEstad
    var data = req.body.dataAbert
    var email = req.body.email
    var cep = req.body.cep
    var rua = req.body.rua
    var numero = req.body.numero
    var bairro = req.body.bairro
    var cidade = req.body.cidade
    var estado = req.body.estado
    var telefone = req.body.telefone
    var celular = req.body.celular
    var descricao = req.body.descricao
    var logo = req.body.logo
    var dataAbert = moment(data).format()
    Empresa.findOne().then(empresa => {
        if (empresa == undefined) {
            Empresa.create({
                nome: nome,
                cnpj: cnpj,
                inscriEstad: inscriEstad,
                dataAbert: dataAbert,
                email: email,
                cep: cep,
                rua: rua,
                numero: numero,
                bairro: bairro,
                cidade: cidade,
                estado: estado,
                telefone: telefone,
                celular: celular,
                descricao: descricao,
                logo: logo
            }).then(empresao => {
                res.redirect("/admin/empresa")
            })
        } else {
            res.send("Ja existe uma empresa cadastrada:" + " " + empresa.nome)
        }
    })
})

router.get("/admin/empresa/editar/:empresaId", (req, res) => {
    var empresaId = req.params.empresaId
    if (empresaId != undefined) {
        if (!isNaN(empresaId)) {
            Empresa.findByPk(empresaId).then(empresa => {
                if (empresa != undefined) {
                    var data = moment(empresa.dataAbert).format("YYYY-MM-DD")
                    res.render("admin/empresa/editar", { empresa: empresa, data: data })
                } else {
                    res.json({ resp: "Erro. Empresa não existe" })
                }
            })
        } else {
            res.json({ resp: "Erro. Requisição não é um numero" })
        }
    } else {
        res.json({ resp: "Erro. Requisição não existe" })
    }
})

router.post("/empresa/edit",(req, res) => {
    var empresaId = req.body.empresaId
    var nome = req.body.nome
    var cnpj = req.body.cnpj
    var inscriEstad = req.body.inscriEstad
    var data = req.body.dataAbert
    var email = req.body.email
    var cep = req.body.cep
    var rua = req.body.rua
    var numero = req.body.numero
    var bairro = req.body.bairro
    var cidade = req.body.cidade
    var estado = req.body.estado
    var telefone = req.body.telefone
    var celular = req.body.celular
    var descricao = req.body.descricao
    var logo = req.body.logo
    var dataAbert = moment(data).format()
    if (empresaId != undefined) {
        if (!isNaN(empresaId)) {
            if(nome != "" && cnpj != "" && inscriEstad != "" && data != "" && email != "" && cep != "" && rua != "" && numero != "" && bairro != "" && cidade != "" && estado != "" && celular != ''){
            Empresa.findByPk(empresaId).then(empresa => {
                Empresa.update({
                    nome: nome,
                    cnpj: cnpj,
                    inscriEstad: inscriEstad,
                    dataAbert: dataAbert,
                    email: email,
                    cep: cep,
                    rua: rua,
                    numero: numero,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado,
                    telefone: telefone,
                    celular: celular,
                    descricao: descricao,
                    logo: logo
                },{where:{id:empresa.id}}).then(()=>{
                    res.redirect("/admin/empresa")
                })
            }).catch(err => {
                res.json({ resp: err })
            })
        }else{
            res.json({ resp: "Dados marcados com * não podem ficar vazio" })

        }
        } else {
            res.json({ resp: "Nenhuma alteração feita por inconsistencia dos dados" })
        }
    } else {
        res.json({ resp: "Nenhuma alteração feita por inconsistencia dos dados" })
    }

})

router.get("/empresa", (req, res) => {
    Empresa.findOne().then(empresa => {
        if (empresa != undefined) {
            res.json(empresa)
        } else {
            res.send("Erro, fale com seu ADMINISTRADOR")
        }
    })
})

router.get("/admin/empresa", (req, res) => {
    Empresa.findOne().then(empresa => {
        if (empresa != undefined) {
            res.render("admin/empresa/index", { empresa: empresa })
        } else {
            res.send("Erro, fale com seu ADMINISTRADOR")
        }
    })
})

module.exports = router
