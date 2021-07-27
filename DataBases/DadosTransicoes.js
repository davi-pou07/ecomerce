const Sequelize = require('sequelize')
const connection = require('./database')

const DadosTransicoes = connection.define('dadostransicoes',{
    
    dadosId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
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
    collection_status:{
        type:Sequelize.STRING,
        allowNull:true
    },
    formaPagamento:{
        type:Sequelize.STRING,
        allowNull:true
    },
    orderId:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
DadosTransicoes.sync({force:true}).then(()=>{
    console.log("Tabela DadosTransicoes criada");
})

module.exports = DadosTransicoes