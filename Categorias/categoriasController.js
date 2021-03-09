const express = require('express')
const router = express.Router()
const Categoria = require("../DataBases/Categoria")

router.get("/admin/categoria/novo",(req,res)=>{
    res.render("admin/categoria/novo")
})

module.exports = router