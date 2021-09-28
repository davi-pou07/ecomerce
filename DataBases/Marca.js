const Sequelize = require('sequelize')
const connection = require('./database')

const Marca = connection.define('marcas',{
    marca:{
        type:Sequelize.STRING,
        allowNull:false
    }
})


// Marca.sync({force:true}).then(()=>{
//     console.log("Tabela Marcas criada");
// })

module.exports = Marca