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
        allowNull:true
    },
    valorBrutoRecebido:{
        type:Sequelize.FLOAT,
        allowNull:true
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
    dataExpiracao:{
        type:Sequelize.DATE,
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
    statusId:{
        type:Sequelize.INTEGER,
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
    isValidado:{
        type:Sequelize.STRING,
        allowNull:true
    },
    comprovante:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    dadosEntragaId:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
// DadosPagamentos.sync({force:true}).then(()=>{
//     console.log("Tabela DadosPagamentos criada");
// })

module.exports = DadosPagamentos