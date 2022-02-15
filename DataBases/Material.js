const Sequelize = require('sequelize')
const connection = require('./database')

const Material = connection.define('materiais',{
    material:{
        type:Sequelize.STRING,
        allowNull:false
    }
})


// Material.sync({force:true}).then(()=>{
//     console.log("Tabela Materials criada");
// })

module.exports = Material