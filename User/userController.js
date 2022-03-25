const express = require("express");
const multer = require('multer')

const router = express.Router();
const path = require('path')
const fs = require('fs')
//npm install --save bcryptjs
const bcrypt = require("bcryptjs")
const { Op } = require("sequelize");
const User = require("../DataBases/User");
const auth = require("../middlewares/adminAuth")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/user/')
    },
    filename: function (req, file, cb) {
        var userid = req.body.userId
        // var chara = nome.split(' ')[0]
        var chara = `ID${userid}`
        cb(null, Date.now()+ chara + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

router.get("/admin/user/novo",auth, (req, res) => {
    res.render("admin/user/new")
})

router.post("/user/novo",auth, (req, res) => {
    var email = req.body.email
    var nome = req.body.nome
    var telefone = req.body.telefone
    var login = req.body.login
    var senha = req.body.senha
    var foto = req.body.foto

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
                foto: foto
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

router.get("/admin/usuarios",auth, (req, res) => {
    User.findAll().then(usuarios => {
        res.render("admin/user/index", { usuarios: usuarios })
    })
})


router.get("/admin/usuario/editar/:user",auth, (req, res) => {
    userId = req.params.user
    if (userId != undefined) {
        if (!isNaN(userId)) {
            User.findByPk(userId).then(user => {
                res.render("admin/user/edit", { user: user })
            }).catch(err => {
                console.log(err)
            })
        }
    }
})

router.post("/usuario/editar",auth, (req, res) => {
    var login = req.body.login
    var nome = req.body.nome
    var email = req.body.email
    var telefone = req.body.telefone
    var senhaAtual = req.body.senhaAtual
    var senha = req.body.senha
    var confirm = req.body.confirm
    var userId = req.body.userId
    var foto = req.body.foto
    if (login != '' && nome != '' && email != '' && telefone != '') {
        User.findByPk(userId).then(user => {
            if (user != undefined) {
                if (senha == '' && confirm == '' && senhaAtual == '') {
                    senhaAtual = undefined
                    var correct = true
                } else {
                    var correct = bcrypt.compareSync(senhaAtual, user.senha)
                }
                if (correct) {
                    if (senha == confirm && senha != senhaAtual) {
                        User.findOne({ where: { [Op.or]: [{ login: login }, { email: email }] } }).then(usu => {
                            if (usu == undefined || (usu.email == user.email && usu.login == usu.login)) {
                                if (senha != '') {
                                    var salt = bcrypt.genSaltSync(10)
                                    var hash = bcrypt.hashSync(senha, salt)
                                }
                                User.update({
                                    login: login,
                                    nome: nome,
                                    email: email,
                                    telefone: telefone,
                                    senha: hash,
                                    foto: foto
                                }, { where: { id: user.id } }).then(() => {
                                    // res.json({ resp: 'undefined' })
                                    res.redirect("/admin/usuarios")
                                })
                            } else {
                                console.log(usu.email, usu.login)
                                console.log(user.email, user.login)
                                res.json({ resp: "Ja existe um usuario com esses dados" })
                            }
                        })

                    } else {
                        res.json({ resp: "Senhas não são iguais" })
                    }
                } else {
                    res.json({ resp: "Senhas incorreta" })
                }
            } else {
                res.json({ resp: "usuario não encontrado" })
            }
        })
    } else {
        res.json({ resp: "Informação marcads com * não pode ficar vazia" })
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
                    res.redirect("/")
                } else {
                    console.log("Senha incorreta")
                    res.json({ resp: "Credenciais Incorreta" })
                }
            } else {
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
    // console.log(req.session)
    res.redirect("/")
})


//Axios
router.get("/user", (req, res) => {
    var log = req.session.usu
    if (log != undefined) {
        User.findByPk(log.id).then(user => {
            res.json({login:user.login,id:user.id,foto:user.foto})
        })
    } else {
        res.json("Erro: Nenhum usuario logado")
    }
})


module.exports = router