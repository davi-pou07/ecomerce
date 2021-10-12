const Sequelize = require('sequelize')
const connection = require('./database')
const Categoria = require("./Categoria")

const Produto = connection.define('produtos',{
    nome:{
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
    totEstoque:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    gradeId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    marcaId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    materialId:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
})

Produto.belongsTo(Categoria)

// Produto.sync({force:true}).then(()=>{
//     console.log("Tabela Produto criada")        
// })

module.exports = Produto
