const express = require('express')
const router = express()
const Sequelize = require('sequelize')
const knex = require('../DataBases/dataBaseCL')
const moment = require('moment')
const Produto = require("../DataBases/Produto")
const { Op, ConnectionTimedOutError } = require("sequelize");
const DadosVendas = require('../DataBases/DadosVendas')
const DadosPagamentos = require('../DataBases/DadosPagamentos')
const DadosPagamentosPix = require('../DataBases/DadosPagamentosPix')
const DadosPagamentosEntrega = require('../DataBases/DadosPagamentosEntrega')
const DadosTransicoes = require('../DataBases/DadosTransicoes')
const DadosEntregas = require('../DataBases/DadosEntregas')
const { data } = require('jquery')
//-----------VENDAS EM PROCESSO ------------//
router.get("/admin/vendas/processo", async (req, res) => {
    var carrinhos = await knex("carrinhos").select().where({ status: true }).andWhere('quantidade', '>', 0).orderBy('createdAt', 'asc')
    var clienteIds = []
    var carrinhosIds = []
    var datasCarrinho = []
    var produtosIds = []

    carrinhos.forEach(carrinho => {
        clienteIds.push(carrinho.clienteId)
        carrinhosIds.push(carrinho.id)
        datasCarrinho.push({ carrinhoId: carrinho.id, clienteId: carrinho.clienteId, data: moment(carrinho.updatedAt).format('DD/MM/YYYY') })
        carrinho.precoTotal = carrinho.precoTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    })

    var clientes = await knex("clientes").select().whereIn('id', clienteIds)
    var codItens = await knex("coditens").select().whereIn('carrinhoId', carrinhosIds)

    codItens.forEach(codItem => {
        produtosIds.push(codItem.produtoId)
        codItem.updatedAt = moment(codItem.updatedAt).format('DD/MM/YYYY')
        codItem.precoUnit = codItem.precoUnit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        codItem.precoTotalItem = codItem.precoTotalItem.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    })

    var produtos = await Produto.findAll({
        where: {
            id: { [Op.in]: produtosIds }
        }
    })

    res.render("admin/vendas/processo", { carrinhos: carrinhos, clientes: clientes, codItens: codItens, datasCarrinho: datasCarrinho, produtos: produtos })
})
//-----------FIM VENDAS EM PROCESSO ------------//

//----------- VENDAS ------------//
router.get("/admin/vendas/transicoes", async (req, res) => {

    var clientes = await knex('clientes').select('id', 'nome').where({ status: true })
    var carrinhos = await knex('carrinhos').select()
    var codItens = await knex("coditens").select()


    var dadosVendas = await DadosVendas.findAll()
    var datasVendas = []
    dadosVendas.forEach(dadoVenda => {
        var dat = dadoVenda.updatedAt
        var data = moment(dat).format('DD/MM/YYYY')
        datasVendas.push({ data: data, dadosId: dadoVenda.dadosId })
        dadoVenda.unit_price = dadoVenda.unit_price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    })

    var dadosTransicoes = await DadosTransicoes.findAll()
    var datasTransicoes = []
    dadosTransicoes.forEach(transicoes => {
        var d = transicoes.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasTransicoes.push({ data: data, dadosId: transicoes.dadosId })
    })

    var dadosPagamentos = await DadosPagamentos.findAll()
    var datasPagamento = []
    dadosPagamentos.forEach(pagamento => {
        var d = pagamento.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasPagamento.push({ data: data, dadosId: pagamento.dadosId })
    })

    var dadosPagamentosPix = await DadosPagamentosPix.findAll()
    var datasPagamentoPix = []
    dadosPagamentosPix.forEach(pagamento => {
        var d = pagamento.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasPagamentoPix.push({ data: data, dadosId: pagamento.dadosId })
    })

    var dadosPagamentosEntrega = await DadosPagamentosEntrega.findAll()
    var datasPagamentoEntrega = []
    dadosPagamentosEntrega.forEach(pagamento => {
        var d = pagamento.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasPagamentoEntrega.push({ data: data, dadosId: pagamento.dadosId })
    })

    var dadosEntregas = await DadosEntregas.findAll()
    var datasDadosEntregas = []
    dadosEntregas.forEach(dadosEntrega => {
        console.log(dadosEntrega.dataPrevista)
        dadosEntrega.dataPrevista = moment(dadosEntrega.dataPrevista).format('DD/MM/YYYY')
        console.log(dadosEntrega.dataPrevista)

    })

    res.render("admin/vendas/transicoes", {
        clientes: clientes,
        carrinhos: carrinhos,
        codItens: codItens,
        dadosVendas: dadosVendas,
        dadosTransicoes: dadosTransicoes,
        dadosPagamentos: dadosPagamentos,
        dadosPagamentosPix: dadosPagamentosPix,
        dadosPagamentosEntrega: dadosPagamentosEntrega,
        datasVendas: datasVendas,
        datasTransicoes: datasTransicoes,
        datasPagamento: datasPagamento,
        datasPagamentoPix: datasPagamentoPix,
        datasPagamentoEntrega: datasPagamentoEntrega,
        dadosEntregas: dadosEntregas,
        datasDadosEntregas: datasDadosEntregas
    })
})
//-----------FIM VENDAS ------------//

module.exports = router