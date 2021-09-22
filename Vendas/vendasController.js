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
    console.log("Algo?0")
    var dadosPagamentos = await DadosPagamentos.findAll()
    console.log("Algo?1")
    var datasPagamento = []
    dadosPagamentos.forEach(pagamento => {
        console.log("Algo?3")
        var d = pagamento.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasPagamento.push({ data: data, dadosId: pagamento.dadosId })
    })
    console.log("Algo?2")

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
    // var datasDadosEntregas = []
    // dadosEntregas.forEach(dadosEntrega => {
    //     dadosEntrega.dataPrevista = moment(dadosEntrega.dataPrevista).format('DD/MM/YYYY')
    // })

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
        // datasDadosEntregas: datasDadosEntregas
    })
})
//-----------FIM VENDAS ------------//

//-----------FILTO VENDAS ------------//



//-----------FILTO VENDAS ------------//

// -----------PRODUTOS VENDAS -----------//
router.get("/produtos/vendas/:dadosVendasId", async (req, res) => {
    var dadosVendasId = req.params.dadosVendasId
    var produto = []
    try {
        var dadoVenda = await DadosVendas.findByPk(dadosVendasId)
        if (dadoVenda != undefined) {
            var carrinho = await knex("carrinhos").select().where({ id: dadoVenda.carrinhoId, clienteId: dadoVenda.clienteId })
            var codItens = await knex("coditens").select().where({ carrinhoId: carrinho[0].id })

            var produtosIds = []
            codItens.forEach(codItem => {
                produtosIds.push(codItem.produtoId)
            })
            var produtos = await Produto.findAll({
                where: {
                    id: { [Op.in]: produtosIds }
                }
            })

            var descontoTotal = 0
            var valorTotal = 0
            var quantidadeTotal = 0
            codItens.forEach(codItem => {
                var nome = produtos.find(p => p.id == codItem.produtoId)

                descontoTotal = descontoTotal + 0
                valorTotal = valorTotal+codItem.precoTotalItem
                quantidadeTotal = quantidadeTotal + codItem.quantidade
                var desconto = 0
                    produto.push({
                        id: codItem.produtoId,
                        nome: nome.nome,
                        precoUnit: codItem.precoUnit.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                        quantidade: codItem.quantidade,
                        desconto: desconto.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                        valotTotalItem: codItem.precoTotalItem.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    })
            })
            valores = {
                descontoTotal:descontoTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                valorTotal:valorTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                quantidadeTotal:quantidadeTotal
            }

            res.json({ produtos: produto, valores:valores})

        } else {
            res.json({ erro: "Venda Inexistente" })
        }
    } catch (err) {
        console.log(err)
        res.json({ erro: "Não foi possivel cosultar venda" })
    }
})

//-----------FIM PRODUTOS VENDAS ------------//

//-----------EDIÇÃO DE VENDA ------------//
router.get("/teste",(req,res) =>{
    res.render("admin/vendas/edicao")
})
//-----------FIM EDIÇÃO DE VENDA ------------//

module.exports = router
