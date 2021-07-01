const Sequelize = require('sequelize')
const connection = require('./database')

const DadosVendas = connection.define('dadosvendas',{
    
    dadosId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    quantidade:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    currency_id:{
        type:Sequelize.STRING,
        allowNull:false
    },
    unit_price:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    emailCliente:{
        type:Sequelize.STRING,
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
    tentativas:{
        type:Sequelize.STRING,
        allowNull:true
    }
})
DadosVendas.sync({force:true}).then(()=>{
    console.log("Tabela DadosVendas criada");
})

module.exports = DadosVendas