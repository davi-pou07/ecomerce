require('dotenv').config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
const session = require("express-session")
const bodyParser = require("body-parser")
const moment = require('moment');
const { Op } = require("sequelize");

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
//const DadosTransicoes = require("./DataBases/DadosTransicoes")
const LocaisDelivery = require("./DataBases/LocaisDelivery")
const dadosEntregas = require("./DataBases/DadosEntregas")
const banners = require("./DataBases/Banners")
//DadosPagamentosPix = require("./DataBases/DadosPagamentosPix")
//const DadosPagamentosEntrega = require("./DataBases/DadosPagamentosEntrega")
const StatusEntrega = require("./DataBases/StatusEntrega")
const Marca = require("./DataBases/Marca")
const Material = require("./DataBases/Material")


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
const materialController = require("./Material/materialController")
const atualizacaoController = require("./Atualizar/atualizacaoControler")
const clienteController = require("./Clientes/clientesController")

const connection = require('./DataBases/database')
//databases
const path = require('path')
const PORT = process.env.PORT || 8080

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
app.use("/", materialController)
app.use("/", clienteController)

app.get("/", async(req, res) => {
    var exitUser = await User.findOne()
    if (exitUser) {
       var empres = await Empresa.findOne()
        if (empres == undefined) {
            res.redirect("/admin/empresa/novo")
        } else {

            res.render("index", { empres: empres})
        }
    }else{
        req.session.usu = 0
        res.redirect("/admin/user/novo")
    }
})
app.get("/relatorioVendas/:tipo/:valor",async(req,res)=>{
    console.log(new Date())
    var tipo = req.params.tipo
    var valor = req.params.valor
    var inicioDo = ''
    var stOf= ''
    var dados = {
        labels:[],
        autorizados:[],
        rejeitados:[],
        pendentes:[],
    }

    if (tipo == 'A') {
        inicioDo = 'year'
        stOf = 'year'
        valor = valor.split("-")[0]
        var inicio = moment(valor,inicioDo).startOf(stOf).format("YYYY-MM-DD")
        var fim = moment(valor,inicioDo).endOf(stOf).format("YYYY-MM-DD")
    } else if (tipo == 'M') {
        inicioDo = 'MM-YYYY'
        stOf = 'month'
        valor = moment(valor,"YYYY-MM-DD").format(inicioDo)
        var inicio = moment(valor,inicioDo).startOf(stOf).format("YYYY-MM-DD")
        var fim = moment(valor,inicioDo).endOf(stOf).format("YYYY-MM-DD")
    }else if(tipo == 'S'){
        inicioDo = 'DD-MM-YYYY'
        stOf = 'week'
        valor = moment(valor,"YYYY-MM-DD").format(inicioDo)
        var inicio = moment(valor,inicioDo).startOf(stOf).format("YYYY-MM-DD")
        var fim = moment(valor,inicioDo).endOf(stOf).format("YYYY-MM-DD")
    }

    if (inicioDo != '') {
    var vendas = await DadosVendas.findAll({
        where:{
            createdAt: {
                [Op.between]: [moment(inicio), moment(fim)]
            }
        },
        order: [['createdAt', 'asc']]
    })

    vendas.forEach(venda => {
        if (dados.labels.find(dl => dl == moment(venda.createdAt).format("DD-MM-YYYY")) == undefined) {
            dados.labels.push(moment(venda.createdAt).format("DD-MM-YYYY"))
        }
        if (venda.statusId == 1) {
            dados.pendentes.push({id:venda.id,status:venda.statusId,data:moment(venda.createdAt).format("DD-MM-YYYY")})
        } else if (venda.statusId == 2) {
            dados.autorizados.push({id:venda.id,status:venda.statusId,data:moment(venda.createdAt).format("DD-MM-YYYY")})
        }else if (venda.statusId == 3) {
            dados.rejeitados.push({id:venda.id,status:venda.statusId,data:moment(venda.createdAt).format("DD-MM-YYYY")})
        }
    });
    res.json({inicio:inicio,fim:fim,dados:dados})
  
    } else {
        res.json({erro:"Filtro inválido"})
    }
})

app.listen(PORT, () => {
    console.log("Servidor ligado")
})
