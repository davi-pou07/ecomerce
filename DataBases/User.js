const Sequelize = require("sequelize")
const connection = require("./database")

const User =  connection.define('users',{
    login:{
        type: Sequelize.STRING,
        allowNull: false
    },senha: {
        type: Sequelize.STRING,
        allowNull: false
    },isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull:false
    },email:{
        type: Sequelize.STRING,
        allowNull:false
    },telefone: {
        type: Sequelize.STRING,
        allowNull:false
    },nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    status:{
        type: Sequelize.BOOLEAN,
        allowNull:false
    },foto:{
        type: Sequelize.TEXT,
        allowNull:true
    }
    
})

//Arquivo foi removido para não tentar criar toda vez que o projeto rodar
// User.sync({force:true}).then(()=>{console.log("usuario ok")})

module.exports= User