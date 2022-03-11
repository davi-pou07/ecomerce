const express = require("express")
const router = express.Router()
const auth = require("../middlewares/adminAuth")
const knex = require("../DataBases/dataBaseCL")
const moment = require("moment")

router.get("/admin/clientes",auth,async(req, res) => {
    var clientes = await knex("clientes").select()
    for(x=0;x<clientes.length;x++){
        clientes[x].createdAt = moment(clientes[x].createdAt).format("DD-MM-YYYY")
    }
    res.render("admin/cliente/index", { clientes: clientes })
})

module.exports = router