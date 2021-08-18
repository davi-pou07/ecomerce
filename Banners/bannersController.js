const express = require('express')
const router = express()
const Sequelize = require('sequelize')
const Banners = require("../DataBases/Banners")

router.get("/admin/banners", (req, res) => {
    Banners.findAll().then(banners => {
        res.render("admin/banners/index", { banners: banners })
    })
})

router.get("/admin/banners/adicionar", (req, res) => {
    var resp = req.query.resp
    res.render("admin/banners/adicionar.ejs", { resp: resp })
})

router.post("/admin/banners/salvar", (req, res) => {
    var { imagem, titulo, destaque, status } = req.body
    if (imagem != undefined && titulo != undefined && destaque != undefined && status != undefined) {
        Banners.create({
            img: imagem,
            titulo: titulo,
            destaque: destaque,
            status: status
        }).then(() => {
            res.redirect("/admin/banners/adicionar/?resp=1")
        }).catch(err => {
            console.log(err)
        })
    } else {
        res.redirect("/admin/banners/adicionar/?resp=0")
    }
})

router.get("/admin/banner/editar/:bannerId", (req, res) => {
    var bannerId = req.params.bannerId
    console.log(bannerId)
    if (bannerId != undefined) {
        console.log("1")
        if (!isNaN(bannerId)) {
            console.log("2")

            Banners.findByPk(bannerId).then(banner => {
                res.render("admin/banners/editar", { banner: banner })
            })
        } else {

        }
    } else {

    }
    res.render("admin/banners/adicionar.ejs", { resp: resp })
})

module.exports = router