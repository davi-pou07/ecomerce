const Sequelize = require('sequelize')
const connection = require('./database')

const Empresa = connection.define('empresas', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cnpj: {
        type: Sequelize.STRING,
        allowNull: false
    },
    inscriEstad: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dataAbert: {
        type: Sequelize.DATE,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, cep: {
        type: Sequelize.STRING,
        allowNull: false
    }, rua: {
        type: Sequelize.STRING,
        allowNull: false
    }, numero: {
        type: Sequelize.INTEGER,
        allowNull: true
    }, bairro: {
        type: Sequelize.STRING,
        allowNull: false
    }, cidade: {
        type: Sequelize.STRING,
        allowNull: false
    }, estado: {
        type: Sequelize.STRING,
        allowNull: false
    }, telefone: {
        type: Sequelize.STRING,
        allowNull: true
    }, celular: {
        type: Sequelize.STRING,
        allowNull: true
    }, descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    }, logo: {
        type: Sequelize.TEXT,
        allowNull: true
    }, dominio:{
        type:Sequelize.STRING,
        allowNull:true
    }
})


// Empresa.sync({force:true}).then(()=>{
//     console.log("Tabela Empresa criada")        
// })

module.exports = Empresa
