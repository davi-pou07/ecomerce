const Sequelize = require('sequelize')
const connection = require('./database')

const Grade = connection.define('grades',{
    descricao:{
        type:Sequelize.STRING,
        allowNull:false
    },
    linha:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna:{
        type:Sequelize.STRING,
        allowNull:false
    },
    n_linha:{
        type:Sequelize.STRING,
        allowNull:false
    },
    n_coluna:{
        type:Sequelize.STRING,
        allowNull:false  
    }
})

Grade.sync({force:true}).then(()=>{
    console.log("Tabela Grade criada")        
})

module.exports = Grade
