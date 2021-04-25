const express = require("express");
const router = express.Router();
const User = require("../DataBases/User");
const multer = require('multer')
const path = require('path')
const fs = require('fs')
//npm install --save bcryptjs
const bcrypt = require("bcryptjs")
const { Op } = require("sequelize");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/user/')
    },
    filename: function (req, file, cb) {
        // var nome = req.body.nome
        // console.log(nome)
        // var chara = nome.split(' ')[0]
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

router.get("/admin/user/novo", (req, res) => {
    res.render("admin/user/new")
})

router.post("/user/novo", upload.single('avatar'), (req, res) => {
    var file = req.file
    var imagem = file.destination.replace("public", "") + file.filename
    var email = req.body.email
    var nome = req.body.nome
    var telefone = req.body.telefone
    var login = req.body.login
    var senha = req.body.senha

    User.findOne({ where: { [Op.or]: [{ login: login }, { email: email }] } }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(senha, salt)
            User.create({
                login: login,
                senha: hash,
                email: email,
                nome: nome,
                telefone: telefone,
                isAdmin: true,
                status: true,
                foto: imagem
            }).then(() => {
                res.redirect("/")
            }).catch(err => {
                res.redirect("/")
            })
        } else {
            res.send("USUARIO EXISTENTE")
        }
    })
})

router.get("/admin/usuarios", (req, res) => {
    User.findAll().then(usuarios => {
        res.render("admin/user/index", { usuarios: usuarios })
    })
})


router.get("/admin/usuario/editar/:user", (req, res) => {
    userId = req.params.user
    if (userId != undefined) {
        if (!isNaN(userId)) {
            User.findByPk(userId).then(user => {
                res.render("admin/user/edit", { user: user })
            })
        }
    }

})

router.get("/login", (req, res) => {
    res.render("admin/user/login")
})

router.post("/autenticar", (req, res) => {
    var login = req.body.login
    var senha = req.body.senha
    User.findOne({ where: { login: login } }).then(usu => {
        if (usu != undefined) {
            if (usu.status != false) {

                //validar senha
                var correct = bcrypt.compareSync(senha, usu.senha)
                if (correct) {
                    req.session.usu = {
                        id: usu.id,
                        login: usu.login
                    }
                    // res.json(req.session.usu)
                    res.redirect("/")
                } else {
                    console.log("Senha incorreta")
                    res.json({ resp: "Credenciais Incorreta" })
                }
            }else{
                console.log("Usuario desativado")
                res.json({ resp: "Credenciais Incorreta" }) 
            }
        } else {
            console.log("Não encontrado")
            res.json({ resp: "Credenciais Incorreta" })
        }
    })
})


router.get("/logout", (req, res) => {
    req.session.usu = undefined
    console.log(req.session)
    res.redirect("/")
})


//Axios
router.get("/user", (req, res) => {
    var log = req.session.usu
    if (log != undefined) {
        User.findByPk(log.id).then(user => {
            res.json(user)
        })
    } else {
        res.json("Erro: Nenhum usuario logado")
    }
})


module.exports = router