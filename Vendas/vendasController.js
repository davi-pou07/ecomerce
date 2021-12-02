const express = require('express')
const router = express()
const Sequelize = require('sequelize')
const knex = require('../DataBases/dataBaseCL')
const moment = require('moment')
const Produto = require("../DataBases/Produto")
const { Op, ConnectionTimedOutError } = require("sequelize");
const DadosVendas = require('../DataBases/DadosVendas')
const DadosPagamentos = require('../DataBases/DadosPagamentos')
//const DadosPagamentosPix = require('../DataBases/AtualizarTabelas/DadosPagamentosPix.)
//const DadosPagamentosEntrega = require('../DataBases/AtualizarTabelas/DadosPagamentosEntrega')
//const DadosTransicoes = require('../DataBases/AtualizarTabelas/DadosTransicoes')
const DadosEntregas = require('../DataBases/DadosEntregas')
const StatusEntregas = require("../DataBases/StatusEntrega")
const StatusVenda = require("../DataBases/StatusVendas")

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
        console.log(dadoVenda.statusColetado)
        dadoVenda.unit_price = dadoVenda.unit_price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        var status = StatusVenda.find(st => st.id == dadoVenda.statusId)
        dadoVenda.statusId = status.status
    })

    var dadosPagamentos = await DadosPagamentos.findAll()
    var datasPagamento = []
    dadosPagamentos.forEach(pagamento => {
        console.log(pagamento.statusId)
        var d = pagamento.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasPagamento.push({ data: data, dadosId: pagamento.dadosId })
    })

    var dadosEntregas = await DadosEntregas.findAll()

    for (var x = 0; x < dadosEntregas.length; x++) {
        var statusEntrega = await StatusEntregas.findOne({ where: { statusId: dadosEntregas[x].status } })
        dadosEntregas[x].status = statusEntrega.status
        dadosEntregas[x].valor = dadosEntregas[x].valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    
    

    res.render("admin/vendas/transicoes", {
        clientes: clientes,
        carrinhos: carrinhos,
        codItens: codItens,
        dadosVendas: dadosVendas,
        dadosPagamentos: dadosPagamentos,
        datasVendas: datasVendas,
        datasPagamento: datasPagamento,
        dadosEntregas: dadosEntregas,
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
                valorTotal = valorTotal + codItem.precoTotalItem
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
                descontoTotal: descontoTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                valorTotal: valorTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                quantidadeTotal: quantidadeTotal
            }

            res.json({ produtos: produto, valores: valores, dadosId: dadoVenda.dadosId })

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
router.get("/admin/vendas/transicoes/editar/:dadosId", async (req, res) => {
    var dadosId = req.params.dadosId
    try {
        var dadoVenda = await DadosVendas.findOne({ where: { dadosId: dadosId } })
        dadoVenda.unit_price = dadoVenda.unit_price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

        if (dadoVenda.status == 'P') {
            dadoVenda.status = 'Pendente'
        } else if (dadoVenda.status == 'A') {
            dadoVenda.status = 'Autorizado'
        } else if (dadoVenda.status == 'R') {
            dadoVenda.status = 'Rejeitado'
        } else if (dadoVenda.status == 'C') {
            dadoVenda.status = 'Cancelado'
        }

        if (dadoVenda != undefined) {
            var produtosIds = []
            var produto = []
            var descontoTotal = 0
            var valorTotal = 0
            var quantidadeTotal = 0
            var totaisProdutos = 0

            var cliente = await knex("clientes").select("foto", "id", "nome", "email", "isWhats", "numero").where({ id: dadoVenda.clienteId })
            var carrinho = await knex("carrinhos").select().where({ id: dadoVenda.carrinhoId })
            var codItens = await knex("coditens").select().where({ carrinhoId: carrinho[0].id })

            codItens.forEach(codItem => {
                produtosIds.push(codItem.produtoId)
                totaisProdutos = totaisProdutos + 1
            })
            var produtos = await Produto.findAll({
                where: {
                    id: { [Op.in]: produtosIds }
                }
            })

            codItens.forEach(codItem => {
                var nome = produtos.find(p => p.id == codItem.produtoId)
                descontoTotal = descontoTotal + 0
                valorTotal = valorTotal + codItem.precoTotalItem
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
                descontoTotal: descontoTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                valorTotal: valorTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                quantidadeTotal: quantidadeTotal,
                totaisProdutos: totaisProdutos
            }

            var dadosEntregas = await DadosEntregas.findOne({ where: { carrinhoId: carrinho[0].id, clienteId: cliente[0].id } })
            dadosEntregas.valor = dadosEntregas.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            var statusEntrega = await StatusEntregas.findAll()

            if (dadoVenda.opcaoDePagamento == 1) {
                dadoVenda.opcaoDePagamento = 'Pix'
            } else if (dadoVenda.opcaoDePagamento == 2) {
                dadoVenda.opcaoDePagamento = 'Mercado Pago'
            } else if (dadoVenda.opcaoDePagamento == 3) {
                dadoVenda.opcaoDePagamento = 'Pagar na Entrega'
            }
            var dadosPagamentos = await DadosPagamentos.findOne({ where: { dadosId: dadoVenda.dadosId } })

            res.render("admin/vendas/edicao", {
                dadoVenda: dadoVenda,
                cliente: cliente[0],
                carrinho: carrinho[0],
                codItens: codItens,
                dadosEntregas: dadosEntregas,
                dadosPagamentos: dadosPagamentos,
                produto: produto,
                valores: valores,
                statusEntrega: statusEntrega
            })
        } else {
            console.log("Venda não encontrada")
            res.redirect("/admin/vendas/transicoes")
        }
    } catch (err) {
        console.log(err)
        res.redirect("/admin/vendas/transicoes")
    }
})
//-----------FIM EDIÇÃO DE VENDA ------------//

// ------------------ALETERAR ITEM CARRINHO---------------

router.get("/consultaCodItem", async (req, res) => {
    var codItemId = req.body.codItemId
    try {
        var codItem = await knex("coditens").select().where({ id, codItemId })
        if (codItem != undefined) {
            var produto = await Produto.findByPk(codItem.produtoId)
            if (produto != undefined) {
                res.json({ codItem: codItem[0], produto: produto })
            } else {
                res.json({ erro: "Produto inexistente" })
            }
        } else {
            res.json({ erro: "Item inexistente" })
        }
    } catch (err) {
        console.log(err)
        res.json({ erro: "Erro ao consultar item" })
    }
})

//---------------FIM ALETERAR ITEM CARRINHO---------------

module.exports = router
