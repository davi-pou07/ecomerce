const Sequelize = require('sequelize')
const connection = require('./database')

const StatusEntrega = connection.define('statusentregas',{
    statusId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    status:{
        type:Sequelize.STRING,
        allowNull:false
    }
})


// StatusEntrega.sync({force:true}).then(()=>{
//     console.log("Tabela Status entrega criada")        
// })



module.exports = StatusEntrega
