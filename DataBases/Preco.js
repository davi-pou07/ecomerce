const Sequelize = require('sequelize')
const connection = require('./database')
const Produto = require('./Produto')

const Preco = connection.define('precos',{
    custo:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    venda:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    desconto:{
        type:Sequelize.FLOAT ,
        allowNull:true
    }
})

Preco.belongsTo(Produto,{unique:true})

Preco.sync({force:true}).then(()=>{
    console.log("Tabela Preco criada")
})

module.exports = Preco
