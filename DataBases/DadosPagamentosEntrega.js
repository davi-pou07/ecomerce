const Sequelize = require('sequelize')
const connection = require('./database')

const DadosPagamentosEntrega = connection.define('dadospagamentosentrega',{  
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
        allowNull:true
    },
    dadosId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    ordeId:{
        type:Sequelize.STRING,
        allowNull:true
    },
    cpf:{
        type:Sequelize.STRING,
        allowNull:false
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    numero:{
        type:Sequelize.STRING,
        allowNull:false
    },
    dadosEntragaId:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

// DadosPagamentosEntrega.sync({force:true}).then(()=>{
//     console.log("Tabela DadosPagamentosEntrega criada");
// })

module.exports = DadosPagamentosEntrega