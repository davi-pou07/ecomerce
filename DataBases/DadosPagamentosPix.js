const Sequelize = require('sequelize')
const connection = require('./database')

const DadosPagamentosPix = connection.define('dadospagamentospix',{  
    status:{
        type:Sequelize.STRING,
        allowNull:false
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
        allowNull:false
    },
    comprovante:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    dadosId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
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