const Sequelize = require('sequelize')
const connection = require('./database')
const Produto = require("./Produto")
const Promocao = require("./Promocao")

const PromoProd = connection.define('promoprod')

PromoProd.belongsTo(Produto)
PromoProd.belongsTo(Promocao)


PromoProd.sync({force:true}).then(()=>{
    console.log("Tabela PromoProd criada")        
})

module.exports = PromoProd
