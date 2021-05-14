const Sequelize = require('sequelize')
const connection = require('./database')
const Grade = require('./Grade')

const G_linha = connection.define('g_linhas',{
    linha1:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha2:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha3:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha4:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha5:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha6:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha7:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha8:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha9:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha10:{
        type:Sequelize.STRING,
        allowNull:true
    },
    codl1:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl2:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl3:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl4:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl5:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl6:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl7:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl8:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl9:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codl10:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
})

G_linha.belongsTo(Grade)

G_linha.sync({force:true}).then(()=>{
    console.log("Tabela G_Linha criada")        
})

module.exports = G_linha
