const Sequelize = require('sequelize')
const connection = require('./database')
const Produto = require("./Produto")

const Promocao = connection.define('promocao',{
    titulo:{
        type:Sequelize.STRING,
        allowNull:false
    },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    valor:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    dataExp:{
        type:Sequelize.DATE,
        allowNull:true
    },
    banner:{
        type:Sequelize.STRING,
        allowNull:true
    },
    porcentagem:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
})


// Promocao.sync({force:true}).then(()=>{
//     console.log("Tabela Promoção criada")        
// })

module.exports = Promocao
