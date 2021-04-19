const express = require("express")
const app = express()
const session = require("express-session")
const bodyParser = require("body-parser")
const categoriaController = require("../ecomerce/Categorias/categoriasController")
const gradeController = require("../ecomerce/Grade/gradeController")
const produtoController = require("./Produto/produtoController")
const estoqueController = require("./Estoque/estoqueController")
const userController = require("./User/userController")
const Categoria = require("./DataBases/Categoria")
const Grade = require("./DataBases/Grade")
const G_coluna = require("./DataBases/G_coluna")
const G_linha = require("./DataBases/G_linha")
const Produto =  require("./DataBases/Produto")
const Estoque = require("./DataBases/Estoque")
const Preco = require("./DataBases/Preco")
const Usuer = require("./DataBases/User")
const Promocao = require("./DataBases/Promocao")
const PromoProd = require("./DataBases/Promoprod")
const Empresa = require("./DataBases/Empresa")




const connection = require('./DataBases/database')
//databases
const path = require('path')
const PORT = process.env.PORT || 8080

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });



app.use(session({
    secret: "sdfsdfsdfgdfgfgh",
    cookie: { maxAge: 1800000000 }
}))

//usar o EJS como view engine | renderizador de html
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//Carregamento de arquivos estaticos no express
app.use(express.static(path.join(__dirname, 'public')))
//Carregamento do bodyPerser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/",categoriaController)
app.use("/",gradeController)
app.use("/",estoqueController)
app.use("/",produtoController)
app.use("/",userController)


app.get("/", (req, res) => { res.render("index") })


app.listen(PORT,()=>{
    console.log("Servidor ligado")
})
