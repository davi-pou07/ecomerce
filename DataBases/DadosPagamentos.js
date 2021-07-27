const Seq = require('sequelize')
const connection = require('./database')
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(/* ... */);
const queryInterface = sequelize.getQueryInterface();

const DadosPagamentos = connection.define('dadospagamentos',{
    dadosId:{
        type:Seq.STRING,
        allowNull:false,
        unique: true
    },
    dataAutorizacao:{
        type:Seq.DATE,
        allowNull:true
    },
    totalPago:{
        type:Seq.FLOAT,
        allowNull:true
    },
    valorBrutoRecebido:{
        type:Seq.FLOAT,
        allowNull:true
    },
    external_reference:{
        type:Seq.STRING,
        allowNull:false
    },
    tipoDePagamento:{
        type:Seq.STRING,
        allowNull:false
    },
    ordeId:{
        type:Seq.STRING,
        allowNull:false
    },
    detalhePagamento:{
        type:Seq.STRING,
        allowNull:true
    },
    dataLancamento:{
        type:Seq.DATE,
        allowNull:true
    },
    dataExpiracao:{
        type:Seq.DATE,
        allowNull:true
    },
    codigoDeBarras:{
        type:Seq.TEXT,
        allowNull:true
    },
    clienteId:{
        type:Seq.INTEGER,
        allowNull:false
    },
    carrinhoId:{
        type:Seq.INTEGER,
        allowNull:false
    },
    status:{
        type:Seq.STRING,
        allowNull:true
    },
    descricao:{
        type:Seq.STRING,
        allowNull:true
    },
    metodoPagamento:{
        type:Seq.STRING,
        allowNull:true
    }
})
queryInterface.addColumn('dadospagamentos', 'boletoUrl', { type:Seq.TEXT,allowNull:true });

DadosPagamentos.sync({force:false}).then(()=>{
    console.log("Tabela DadosPagamentos criada");
})

module.exports = DadosPagamentos