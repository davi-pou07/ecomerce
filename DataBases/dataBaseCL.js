const DB_USERCL = process.env.DB_USERCL
const DB_NAMECL = process.env.DB_NAMECL
const DB_PASSWORDCL = process.env.DB_PASSWORDCL
const DB_HOSTCL = process.env.DB_HOSTCL

const knex = require('knex')({
    client: 'pg',
    version: '13',
    connection: {
      host : DB_HOSTCL,
      user : DB_USERCL,
      password : DB_PASSWORDCL,
      database : DB_NAMECL,
      ssl:{ rejectUnauthorized: false }
    }
  });
//QUANDO TIVER ERRO AO CONECTAR NO SSL DO HEROKU OFF:
//https://stackoverflow.com/questions/61097695/self-signed-certificate-error-during-query-the-heroku-hosted-postgres-database

  module.exports = knex