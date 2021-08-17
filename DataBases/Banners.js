const Sequelize = require('sequelize')
const connection = require('./database')

const Banners = connection.define('banners',{
    
    titulo:{
        type:Sequelize.STRING,
        allowNull:false
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    destaque:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    paginas:{
        type:Sequelize.STRING,
        allowNull:true
    }
})
// Banners.sync({force:true}).then(()=>{
//     console.log("Tabela Banners criada");
// })

module.exports = Banners