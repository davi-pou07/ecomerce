const Sequelize = require('sequelize')
const connection = require('./database')
const Grade = require('./Grade')

const G_coluna = connection.define('g_colunas',{
    coluna:{
        type:Sequelize.STRING,
        allowNull:true
    }
})

G_coluna.belongsTo(Grade)

// G_coluna.sync({force:true}).then(()=>{
//     console.log("Tabela G_coluna criada")        
// })

module.exports = G_coluna
