const Sequelize = require('sequelize')
const connection = require('./database')

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
        allowNull:false
    },
    valorBrutoRecebido:{
        type:Sequelize.FLOAT,
        allowNull:false
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
        type:Sequelize.INTEGER,
        allowNull:false
    },
    detalhePagamento:{
        type:Sequelize.STRING,
        allowNull:false
    },
    dataLancamento:{
        type:Sequelize.DATE,
        allowNull:false
    },
    dataExpiracao:{
        type:Sequelize.DATE,
        allowNull:false
    },
    codigoDeBarras:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    idCliente:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    idCarrinho:{
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
    }
})
// DadosPagamentos.sync({force:true}).then(()=>{
//     console.log("Tabela DadosPagamentos criada");
// })

module.exports = DadosPagamentos