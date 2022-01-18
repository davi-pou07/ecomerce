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
const StatusPagamento = [{ id: 1, status: "Analise" }, { id: 2, status: "Aprovado" }, { id: 3, status: "Rejeitado" }, { id: 4, status: "Cancelado" }, { id: 5, status: "Pendente" }]
const opcaoDePagamentos = [{ id: 1, opcao: "PIX" }, { id: 2, opcao: "MERCADO PAGO" }, { id: 3, opcao: "PAGAR NA ENTREGA" }]


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
        var status = StatusVenda.find(st => st.id == dadoVenda.statusId)
        dadoVenda.statusId = status.status
    })

    var dadosPagamentos = await DadosPagamentos.findAll()
    var datasPagamento = []
    var statusPagamento = []
    dadosPagamentos.forEach(pagamento => {
        var d = pagamento.updatedAt
        var data = moment(d).format('DD/MM/YYYY')
        datasPagamento.push({ data: data, dadosId: pagamento.dadosId })
        var sp = StatusPagamento.find(sp => sp.id == pagamento.statusId)
        statusPagamento.push({ status: sp.status, ordeId: pagamento.ordeId })
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
        statusPagamento: statusPagamento
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

                descontoTotal = descontoTotal + codItem.desconto
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
        

        // if (dadoVenda.status == 'P') {
        //     dadoVenda.status = 'Pendente'
        // } else if (dadoVenda.status == 'A') {
        //     dadoVenda.status = 'Autorizado'
        // } else if (dadoVenda.status == 'R') {
        //     dadoVenda.status = 'Rejeitado'
        // } else if (dadoVenda.status == 'C') {
        //     dadoVenda.status = 'Cancelado'
        // }

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
            var statusEntrega = await StatusEntregas.findAll()

            if (dadoVenda.opcaoDePagamento == 1) {
                dadoVenda.opcaoDePagamento = 'Pix'
            } else if (dadoVenda.opcaoDePagamento == 2) {
                dadoVenda.opcaoDePagamento = 'Mercado Pago'
            } else if (dadoVenda.opcaoDePagamento == 3) {
                dadoVenda.opcaoDePagamento = 'Pagar na Entrega'
            }
            var dadosPagamentos = await DadosPagamentos.findOne({ where: { dadosId: dadoVenda.dadosId } })
            var dataPagamento =  moment(dadosPagamentos.updatedAt).format('DD/MM/YYYY')

            var statusPagamento = StatusPagamento.find(sp => sp.id == dadosPagamentos.statusId)

            res.render("admin/vendas/edicao", {
                dadoVenda: dadoVenda,
                cliente: cliente[0],
                carrinho: carrinho[0],
                codItens: codItens,
                dadosEntregas: dadosEntregas,
                dadosPagamentos: dadosPagamentos,
                dataPagamento:dataPagamento,
                statusPagamento: statusPagamento,
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

router.post("/consultaCodItem", async (req, res) => {
    var codItemId = req.body.codItenId

    try {
        var codItem = await knex("coditens").select().where({ id: codItemId })

        if (codItem != undefined) {
            var produto = await Produto.findByPk(codItem[0].produtoId)

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

router.post("/alterarCodItem",async(req,res)=>{
    var codItemId = req.body.codItemId
    var quantidade = req.body.quantidade
    var desconto = parseFloat(req.body.desconto)
    var acrescimo = parseFloat(req.body.acrescimo)
    var precoUnitario = parseFloat(req.body.precoUnitario)
    if (!isNaN(quantidade) && !isNaN(desconto) && !isNaN(acrescimo)  && !isNaN(precoUnitario)) { 
        var codItem =  await knex("coditens").select().where({id:codItemId})
        var carrinho = await knex('carrinhos').select().where({id:codItem[0].carrinhoId})
        var dadosVendas = await DadosVendas.findOne({where:{carrinhoId:carrinho[0].id}})
        if (codItem[0] != undefined) {
            var valorTotalCodItem = ((precoUnitario * quantidade)+acrescimo) - desconto
            var precoTotalCarrinho = (carrinho[0].precoTotal - codItem[0].precoTotalItem) + valorTotalCodItem
            var quantidadeTotalCarrinho = (carrinho[0].quantidade - codItem[0].quantidade) + quantidade
            var valorTotalVenda = (dadosVendas.unit_price - carrinho[0].precoTotal) + precoTotalCarrinho

            if (((precoUnitario * quantidade) + acrescimo) > desconto) {
                knex("coditens").update({
                    precoUnit:precoUnitario,
                    acrescimo:acrescimo,
                    desconto:desconto,
                    quantidade:quantidade,
                    precoTotalItem:valorTotalCodItem
                }).where({id:codItem[0].id}).then(resp =>{

                    knex('carrinhos').update({
                        quantidade:quantidadeTotalCarrinho,
                        precoTotal:precoTotalCarrinho
                    }).where({id:carrinho[0].id}).then(resp2 =>{
                        DadosVendas.update({
                            unit_price:valorTotalVenda
                        },{where:{id:dadosVendas.id}}).then(resp3 =>{

                            res.json({resp:"Alteração realizada com sucesso"})

                        }).catch(err =>{
                            console.log(err)
                            res.json({erro:"Erro ao fazer atualização dos dados"})
                        })

                    }).catch(err =>{
                        console.log(err)
                        res.json({erro:"Erro ao fazer atualização dos dados"})
                    })

                }).catch(err =>{
                    console.log(err)
                    res.json({erro:"Erro ao fazer atualização dos dados"})
                })
            } else {
                console.log("Erro 1")
                res.json({erro:"Preço de desconto não pode maior que o valor total"})
            }
        } else {
            console.log("Erro 2")
            res.json({erro:"Erro ao fazer atualização dos dados, item não encontrado"})
        }
    } else {
        console.log("Erro 3")
        res.json({erro:"Erro ao fazer atualização dos dados, campo digitado incorretamente"})
    }
   
})

//---------------FIM ALETERAR ITEM CARRINHO---------------

//---------------ALETERAR INFORMAÇÕES ENTREGA---------------

router.post("/alterarEntrega",async(req,res)=>{
    var {cep,numero,rua,bairro,cidade,uf,complemento,dataFrete,frete,statusEntrega,codigoRastreio,valRecebido} = req.body
    if (codigoRastreio != undefined) {

        if ((frete == ''|| frete == undefined)||(cep == ''|| cep == undefined) || (numero == '' || numero == undefined) || (rua == '' || rua == undefined) || (bairro == '' || bairro == undefined) || (cidade == '' || cidade == undefined) || (uf == '' || uf == undefined) || (frete == '' || frete == undefined) || (dataFrete == '' || dataFrete == undefined) ||(statusEntrega == '' || statusEntrega == undefined)) {
            res.json({erro:"Campos obrigatorio com o valor nulo ou vazio \nGentileza preencha todos os campos!"})
        } else {
           var dadosEntrega = await DadosEntregas.findOne({where:{codigoRastreioInterno:codigoRastreio}})
            if (dadosEntrega != undefined) {
                DadosEntregas.update({
                    cep:cep,
                    numero:numero,
                    rua:rua,
                    bairro:bairro,
                    cidade:cidade,
                    uf:uf,
                    complemento:complemento,
                    dataFrete:dataFrete,
                    status:statusEntrega,
                    valRecebido:parseFloat(valRecebido),
                    valor:parseFloat(frete)
                },{where:{id:dadosEntrega.id}}).then(()=>{
                    res.json({resp:'Dados de entrega atualizados com sucesso'})
                }).catch(err =>{
                    console.log(err)
                    res.json({erro:`Ocorreu um erro ao processar dados \n\n${err}`})
                })
            } else {
                res.json({erro:`Ocorreu um erro ao processar dados \nNão foi encontrado nenhuma entrega com codigo de ratreio informado`})
            }
        }
    } else {
        console.log(codigoRastreio)
        res.json({erro:`Ocorreu um erro ao processar dados \nNão foi encontrado nenhuma entrega com codigo de ratreio informado`})

    }
})

//---------------FIM ALETERAR INFORMAÇÕES ENTREGA---------------
//StatusPagamento = [{ id: 1, status: "Analise" }, { id: 2, status: "Aprovado" }, { id: 3, status: "Rejeitado" }, { id: 4, status: "Cancelado" }, { id: 5, status: "Pendente" }]
//StatusVendas = [{ id: 1, status: "Pendente" }, { id: 2, status: "Autorizado" }, { id: 3, status: "Cancelado" }]
//const opcaoDePagamentos = [{ id: 1, opcao: "PIX" }, { id: 2, opcao: "MERCADO PAGO" }, { id: 3, opcao: "PAGAR NA ENTREGA" }]
//const StatusPagamento = [{ id: 1, status: "Analise" }, { id: 2, status: "Aprovado" }, { id: 3, status: "Rejeitado" }, { id: 4, status: "Cancelado" }, { id: 5, status: "Pendente" }]
//---------------ALETERAR INFORMAÇÕES PAGAMENTO---------------
router.post("/atualizarDadosPagamentos",async(req,res)=>{
   var {formPagamento,statusPag,valRecebidoPagamento,comprovantePag,ordemPag,isValidado} =  req.body
   if ((formPagamento == undefined || formPagamento == '') || (statusPag == undefined || statusPag == '') || (valRecebidoPagamento == undefined || valRecebidoPagamento == '') ) {
        res.json({erro:"Informações inválida"})
    }else{
        var dadosPagamento =  await DadosPagamentos.findOne({where:{ordeId:ordemPag}})
        var dadosVendas =  await DadosVendas.findOne({where:{dadosId:dadosPagamento.dadosId}})
        if (dadosPagamento != undefined && dadosVendas != undefined) {

            if (statusPag == 1 || statusPag == 5 ) {
                var stVenda = 1
            } else if (statusPag == 2){
                var stVenda = 2
            }else if (statusPag == 3 || statusPag == 4){
                var stVenda = 3
            }
            var statusVenda = StatusVenda.find(sv => sv.id == stVenda)

            if (formPagamento != dadosVendas.opcaoDePagamento) {

                var opcaoEscolhida = opcaoDePagamentos.find(opd => opd.id == formPagamento)
                
                if (opcaoEscolhida != undefined && statusVenda != undefined) {
                DadosVendas.update({
                    opcaoDePagamento:opcaoEscolhida.id,
                    statusId:statusVenda.id,
                    statusColetado:statusVenda.status
                },{where:{id:dadosVendas.id}}).then(()=>{
                    if (opcaoEscolhida.id ==1 ) {
                        var tpDePag = 'bank_transfer'
                        var dtPag = 'PIX'
                        var mtPag = 'PIX'
                    } else if (opcaoEscolhida.id ==2 ){
                        var tpDePag = 'Cartão'
                        var dtPag = 'acredditad'
                        var mtPag = 'master'
                    } else if (opcaoEscolhida.id ==3 ){
                        var tpDePag = 'pagar_entrega'
                        var dtPag = 'ENTREGA'
                        var mtPag = 'ENTREGA'
                    }

                    DadosPagamentos.update({
                        tipoDePagamento:tpDePag,
                        detalhePagamento:dtPag,
                        metodoPagamento:mtPag,
                        statusId:statusPag,
                        valRecebido:valRecebidoPagamento,
                        comprovante:comprovantePag,
                        isValidado:isValidado
                    },{where:{id:dadosPagamento.id}}).then(()=>{
                        res.json({resp:"ALTERAÇÃO REALIZADA COM SUCESSO!!"})
                    })
                })
                } else {
                    res.json({erro:"OPÇÃO DE PAGAMENTO SELECIONADA INVÁLIDA"})
                }
            } else {
                DadosVendas.update({
                    statusId:statusVenda.id,
                    statusColetado:statusVenda.status
                },{where:{id:dadosVendas.id}}).then(()=>{
                    DadosPagamentos.update({
                        statusId:statusPag,
                        valRecebido:valRecebidoPagamento,
                        comprovante:comprovantePag,
                        isValidado:isValidado
                    },{where:{id:dadosPagamento.id}}).then(()=>{
                        res.json({resp:"ALTERAÇÃO REALIZADA COM SUCESSO!!"})
                    })
                })
            }
        } else {
            res.json({erro:"Não foi possivel encontrar os dados do pagamento especificado"})
        }
    }
})
//---------------FIM ALETERAR INFORMAÇÕES PAGAMENTO---------------


module.exports = router
