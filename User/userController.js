const express = require("express");
const router = express.Router();
const User = require("../DataBases/User");
//npm install --save bcryptjs
const bcrypt = require("bcryptjs")


router.get("/admin/user/novo",(req,res)=>{
    res.render("admin/user/new")
})

router.post("/user/novo",(req,res)=>{
    var login = req.body.login
    var senha = req.body.senha
    User.findOne({where:{login:login}}).then(user =>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(senha,salt)
            User.create({
                login:login,
                senha:hash
            }).then(()=>{
                res.redirect("/")
            }).catch(err =>{
                res.redirect("/")
            })
        }else{
            res.redirect("/admin/user/novo")
        }
    })
})

router.get("/login",(req,res)=>{
    res.render("admin/user/login")
})

router.post("/autenticar",(req,res)=>{
   var login=req.body.login
    var senha=req.body.senha
    console.log(login)
    User.findOne({where:{login:login}}).then(usu =>{
        if(usu != undefined){
            //validar senha
            var correct = bcrypt.compareSync(senha,usu.senha)
            if (correct) {
                req.session.usu = {
                    id:usu.id,
                    login:usu.login
                }
                // res.json(req.session.usu)
                res.redirect("/admin/produtos")
            }else{
                // console.log("não existe")
                res.redirect("/")
            }
        }else{
            // console.log("não encontrado")
            res.redirect("/")
        }
    })
})

router.get("/logout",(req,res)=>{
    req.session.usu = undefined
    res.redirect("/")
})

module.exports = router