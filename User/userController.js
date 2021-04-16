const express = require("express");
const router = express.Router();
const User = require("../DataBases/User");
//npm install --save bcryptjs
const bcrypt = require("bcryptjs")
const { Op } = require("sequelize");

router.get("/admin/user/novo", (req, res) => {
    res.render("admin/user/new")
})

router.post("/user/novo", (req, res) => {
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
                isAdmin:true,
                status:true
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

router.get("/admin/usuarios",(req,res)=>{
    User.findAll().then(usuarios =>{
        res.render("admin/user/index",{usuarios:usuarios})
    })
})

router.get("/login", (req, res) => {
    res.render("admin/user/login")
})

router.post("/autenticar", (req, res) => {
    var login = req.body.login
    var senha = req.body.senha
    User.findOne({ where: { login: login } }).then(usu => {
        if (usu != undefined) {
            //validar senha
            var correct = bcrypt.compareSync(senha, usu.senha)
            if (correct) {
                req.session.usu = {
                    id: usu.id,
                    login: usu.login
                }
                console.log(req.session)
                // res.json(req.session.usu)
                res.redirect("/admin/produtos")
            } else {
                // console.log("não existe")
                res.redirect("/")
            }
        } else {
            // console.log("não encontrado")
            res.redirect("/")
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.usu = undefined
    console.log(req.session)
    res.redirect("/")
})

module.exports = router