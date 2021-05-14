const Sequelize = require('sequelize')
const connection = require('./database')
const Grade = require('./Grade')

const G_coluna = connection.define('g_colunas',{
    coluna1:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna2:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna3:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna4:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna5:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna6:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna7:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna8:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna9:{
        type:Sequelize.STRING,
        allowNull:true
    },
    coluna10:{
        type:Sequelize.STRING,
        allowNull:true
    },
    codc1:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc2:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc3:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc4:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc5:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc6:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc7:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc8:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc9:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    codc10:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
})

G_coluna.belongsTo(Grade)

G_coluna.sync({force:true}).then(()=>{
    console.log("Tabela G_coluna criada")        
})

module.exports = G_coluna
