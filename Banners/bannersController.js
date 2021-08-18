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
    var resp = req.query
    var bannerId = req.params.bannerId
    if (bannerId != undefined) {
        Banners.findByPk(bannerId).then(banner => {
            res.render("admin/banners/editar", { banner: banner, resp: resp })
        })
    } else {
        res.redirect("admin/banners/adicionar.ejs")
    }
})

router.post("/admin/banners/atualizar", async (req, res) => {
    var { imagem, titulo, destaque, status, id } = req.body

    if (titulo != undefined && destaque != undefined && status != undefined) {
        var banner = await Banners.findByPk(id)
        if (banner != undefined) {
            if (imagem == '') {
                imagem = banner.img
            }
            Banners.update({
                img: imagem,
                titulo: titulo,
                destaque: destaque,
                status: status
            }, { where: { id: banner.id } }).then(() => {
                res.redirect("/admin/banner/editar/" + id + "/?resp=1")
            }).catch(err => {
                res.redirect("/admin/banners")
                console.log(err)
            })
        } else {
            res.redirect("/admin/banner/editar/" + id + "/?resp=0")
        }
    } else {
        res.redirect("/admin/banner/editar/" + id + "/?resp=0")
    }
})

module.exports = router