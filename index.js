const express = require("express")
const app = express()
const session = require("express-session")
const Categoria = require("./DataBases/Categoria")

const connection = require('./DataBases/database')
//databases
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

const bodyParser = require("body-parser")

const path = require('path')
const PORT = process.env.PORT || 8080

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

app.get("/", (req, res) => { res.render("index") })


app.listen(PORT,()=>{
    console.log("Servidor ligado")
})
