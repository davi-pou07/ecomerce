const Sequelize = require('sequelize')
const connection = require('./database')

const LocaisDelivery = connection.define('locaisdelivery',{
    cidade:{
        type:Sequelize.STRING,
        allowNull:false
    },
    bairro:{
        type:Sequelize.STRING,
        allowNull:true
    },
    preco:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    estado:{
        type:Sequelize.STRING,
        allowNull:true
    }
})


// LocaisDelivery.sync({force:true}).then(()=>{
//     console.log("Tabela LocaisDelivery criada")        
// })

module.exports = LocaisDelivery
