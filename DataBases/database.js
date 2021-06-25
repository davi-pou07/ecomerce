const Sequelize = require("sequelize");

// const connection = new Sequelize('postgres://postgres:davi6259@localhost:5432/ecomerce')
// const connection = new Sequelize('ecomerce','postgres','davi6259',{
//     host:'localhost',
//     dialect: 'postgres',
//     //configurando timezone
//     timezone: "-03:00",
//     logging:false
// })
const connection = new Sequelize('ecomerce','postgres','davi6259',{
    host:'localhost',
    dialect: 'postgres',
    //configurando timezone
    timezone: "-03:00",
    logging:false
})
// mysql://b4be845f37ea68:295062e4@us-cdbr-east-03.cleardb.com/heroku_9b63551fa2f9a8f?reconnect=true
module.exports = connection;
//postgres://xzohavpuwebfje:cce7fe39b756ba090b9a03883dca985ce43bf137b608cb4cfbc1fcd6ee921e15@ec2-34-200-94-86.compute-1.amazonaws.com:5432/d9f1ts6ismirrp
//https://help.heroku.com/DR0TTWWD/seeing-fatal-no-pg_hba-conf-entry-errors-in-postgres
//https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
//https://devcenter.heroku.com/articles/heroku-postgresql#heroku-postgres-ssl

//https://medium.com/@ochieng.grace/sequelize-your-way-to-heroku-with-express-2c31be3752e0


//heroku config:set PGSSLMODE=no-verify
//heroku pg:reset DATABASE --confirm produtosenderecamento
//set DATABASE_URL=postgres://$(whoami)

//heroku git:remote -a thawing-inlet-61413

