const Sequelize = require('sequelize')
const connection = require('./database')
const Grade = require('./Grade')

const G_linha = connection.define('g_linhas', {
    linha: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

G_linha.belongsTo(Grade)

// G_linha.sync({force:true}).then(()=>{
//     console.log("Tabela G_Linha criada")        
// })

module.exports = G_linha
