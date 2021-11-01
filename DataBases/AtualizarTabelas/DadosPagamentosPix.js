const Sequelize = require('sequelize')
const connection = require('../database')

const DadosPagamentosPix = connection.define('dadospagamentospixes',{  
    status:{
        type:Sequelize.STRING,
        allowNull:false
    },
    statusId:{
        type:Sequelize.INTEGER,
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
    valorRecebido:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    comprovante:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    dadosId:{
        type:Sequelize.STRING,
        allowNull:true
    },
    ordeId:{
        type:Sequelize.STRING,
        allowNull:true
    }
})

// DadosPagamentosPix.sync({force:true}).then(()=>{
//     console.log("Tabela DadosPagamentosPix criada");
// })

module.exports = DadosPagamentosPix