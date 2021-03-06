const Sequelize = require('sequelize')
const connection = require('./database')
const Produto = require('./Produto')

const Imagem = connection.define('imagens',{
    imagem:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    coluna:{
        type:Sequelize.STRING,
        allowNull:true
    },
    linha:{
        type:Sequelize.STRING,
        allowNull:true
    }
})

Imagem.belongsTo(Produto)

// Imagem.sync({force:true}).then(()=>{
//     console.log("Tabela Imagem criada")        
// })

module.exports = Imagem
