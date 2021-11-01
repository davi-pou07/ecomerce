const Sequelize = require('sequelize')
const connection = require('../database')

const DadosEntregas = connection.define('dadosentregas',{
    cep:{
        type:Sequelize.STRING,
        allowNull:false
    },
    numero:{
        type:Sequelize.STRING,
        allowNull:false
    },
    rua:{
        type:Sequelize.STRING,
        allowNull:false
    },
    bairro:{
        type:Sequelize.STRING,
        allowNull:false
    },
    cidade:{
        type:Sequelize.STRING,
        allowNull:false
    },
    uf:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    complemento:{
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
    codigoRastreioInterno:{
        type:Sequelize.STRING,
        allowNull:false
    },
    valor:{
        type:Sequelize.FLOAT,
        allowNull:false
    },dataPrevista:{
        type:Sequelize.STRING,
        allowNull:true
    }
})

// DadosEntregas.sync({force:true}).then(()=>{
//     console.log("Tabela DadosEntregas criada");
// })

module.exports = DadosEntregas