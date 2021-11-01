const Sequelize = require('sequelize')
const connection = require('../database')

const DadosPagamentos = connection.define('dadospagamentos',{
    
    dadosId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    dataAutorizacao:{
        type:Sequelize.DATE,
        allowNull:true
    },
    totalPago:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    valorBrutoRecebido:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    external_reference:{
        type:Sequelize.STRING,
        allowNull:false
    },
    tipoDePagamento:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ordeId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    detalhePagamento:{
        type:Sequelize.STRING,
        allowNull:true
    },
    dataLancamento:{
        type:Sequelize.DATE,
        allowNull:true
    },
    dataExpiracao:{
        type:Sequelize.DATE,
        allowNull:true
    },
    codigoDeBarras:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    clienteId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    carrinhoId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        allowNull:true
    },
    descricao:{
        type:Sequelize.STRING,
        allowNull:true
    },
    metodoPagamento:{
        type:Sequelize.STRING,
        allowNull:true
    },
    boletoUrl:{
        type:Sequelize.TEXT,
        allowNull:true
    }
})
// DadosPagamentos.sync({force:true}).then(()=>{
//     console.log("Tabela DadosPagamentos criada");
// })

module.exports = DadosPagamentos