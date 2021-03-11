const Sequelize = require('sequelize')
const connection = require('./database')

const Complemento = connection.define('complementos',{
    cor:{
        type:Sequelize.STRING,
        allowNull:false
    },
    tamanho:{
        type:Sequelize.STRING,
        allowNull:true
    }
})

Complemento.sync({force:true}).then(()=>{
    console.log("Tabela Complemento criada")        
})

module.exports = Complemento
