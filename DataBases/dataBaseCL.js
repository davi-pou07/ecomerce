const knex = require('knex')({
    client: 'pg',
    version: '13',
    connection: {
      host : 'ec2-35-169-188-58.compute-1.amazonaws.com',
      user : 'naeoolvlzfexcm',
      password : '0097bce388efc76f8d1603d8cd930982f031093997366dc856a3a6aff4b625cc',
      database : 'd6orq1epqv96kp',
      ssl:{ rejectUnauthorized: false }
    }
  });
//QUANDO TIVER ERRO AO CONECTAR NO SSL DO HEROKU OFF:
//https://stackoverflow.com/questions/61097695/self-signed-certificate-error-during-query-the-heroku-hosted-postgres-database

//postgres://xzohavpuwebfje:cce7fe39b756ba090b9a03883dca985ce43bf137b608cb4cfbc1fcd6ee921e15@ec2-34-200-94-86.compute-1.amazonaws.com:5432/d9f1ts6ismirrp
  module.exports = knex