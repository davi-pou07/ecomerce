const Sequelize = require('sequelize')
const connection = require('./database')
const Grade = require('./Grade')
const Produto =  require("./Produto")

const Estoque = connection.define('estoques',{
    refcoluna:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    reflinha:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
    
})

Estoque.belongsTo(Produto)

// Estoque.sync({force:true}).then(()=>{
//     console.log("Tabela Estoque criada")        
// })

module.exports = Estoque
