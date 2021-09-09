const express = require('express')
const router = express()
const Sequelize = require('sequelize')
const knex = require('../DataBases/dataBaseCL')
const moment = require('moment')

//-----------VENDAS PENDENTES ------------//
router.get("/admin/vendas/processo",async(req,res)=>{
   var carrinhos = await knex("carrinhos").select().where({status:true}).orderBy('createdAt','asc')
   var clienteIds = []
   var carrinhosIds = []
   var datas = []

   carrinhos.forEach(carrinho =>{
       clienteIds.push(carrinho.clienteId)
       carrinhosIds.push(carrinho.id)
       datas.push({carrinhoId:carrinho.id,clienteId:carrinho.clienteId,data:moment(carrinho.updatedAt).format('DD/MM/YYYY')})
   })

   var clientes = await knex("clientes").select().whereIn('id',clienteIds)
   var codItens = await knex("coditens").select().whereIn('carrinhoId', carrinhosIds)
   res.render("admin/vendas/pendentes",{carrinhos:carrinhos,clientes:clientes,codItens:codItens,datas:datas})
})
//-----------FIM VENDAS PENDENTES ------------//

module.exports = router
