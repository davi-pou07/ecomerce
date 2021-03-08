const sequelize = require('sequelize')
const connection = require('./database')

const Categoria = connection.define('categorias',{
    titulo:{
        type:sequelize.STRING,
        allowNull:false
    },
    descricao:{
        type:sequelize.TEXT,
        allowNull:true
    }
})

Categoria.sync({alter:true}).then(()=>{
    console.log("Tabela Categoria criada");
})

module.exports = Categoria