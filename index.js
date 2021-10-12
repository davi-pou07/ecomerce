const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
const session = require("express-session")
const bodyParser = require("body-parser")


const Categoria = require("./DataBases/Categoria")
const Produto = require("./DataBases/Produto")
const Grade = require("./DataBases/Grade")
const G_coluna = require("./DataBases/G_coluna")
const G_linha = require("./DataBases/G_linha")
const Estoque = require("./DataBases/Estoque")
const Preco = require("./DataBases/Preco")
const Imagem = require("./DataBases/Imagen")
const User = require("./DataBases/User")
const Promocao = require("./DataBases/Promocao")
const PromoProd = require("./DataBases/Promoprod")
const Empresa = require("./DataBases/Empresa")
const DadosPagamentos = require("./DataBases/DadosPagamentos")
const DadosVendas = require("./DataBases/DadosVendas")
const DadosTransicoes = require("./DataBases/DadosTransicoes")
const LocaisDelivery = require("./DataBases/LocaisDelivery")
const dadosEntregas = require("./DataBases/DadosEntregas")
const banners = require("./DataBases/Banners")
const DadosPagamentosPix = require("./DataBases/DadosPagamentosPix")
const DadosPagamentosEntrega = require("./DataBases/DadosPagamentosEntrega")
const StatusEntrega = require("./DataBases/StatusEntrega")
const Marca = require("./DataBases/Marca")


const categoriaController = require("./Categorias/categoriasController")
const gradeController = require("./Grade/gradeController")
const produtoController = require("./Produto/produtoController")
const estoqueController = require("./Estoque/estoqueController")
const userController = require("./User/userController")
const empresaController = require("./Empresa/empresaController")
const deliveryController = require("./Delivery/deliveryController")
const bannerController = require("./Banners/bannersController")
const vendasController = require("./Vendas/vendasController")
const statusController = require("./Status/statusControler")
const marcaController = require("./Marcas/marcaController")
const atualizacaoController = require("./Atualizar/atualizacaoControler")

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
    cookie: { maxAge: 3600000 }
}))


//usar o EJS como view engine | renderizador de html
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//Carregamento de arquivos estaticos no express
app.use(express.static(path.join(__dirname, 'public')))
//Carregamento do bodyPerser
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }))
app.use(bodyParser.json({ limit: '50mb' }))
const knex = require('./DataBases/dataBaseCL')

app.use("/", categoriaController)
app.use("/", gradeController)
app.use("/", estoqueController)
app.use("/", produtoController)
app.use("/", userController)
app.use("/", empresaController)
app.use("/", deliveryController)
app.use("/", bannerController)
app.use("/", vendasController)
app.use("/", statusController)
app.use("/", atualizacaoController)
app.use("/", marcaController)


app.get("/", (req, res) => {
    // var log = req.session.usu
    // if (log == undefined) {
    //     res.render("admin/user/login")
    // } else {
    Empresa.findOne().then(empres => {
        if (empres == undefined) {
            res.redirect("/admin/empresa/novo")
        } else {
            res.render("index", { empres: empres})
        }
    })
    // }
})

app.listen(PORT, () => {
    console.log("Servidor ligado")
})
