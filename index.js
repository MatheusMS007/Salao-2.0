import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import methodOverride from 'method-override'
import session from 'express-session'
import { sincronizarBD } from './src/config/orm.js'
import routerCliente from './src/routers/routerCliente.js'
import routerAgendamento from './src/routers/routerAgendamento.js'
import routerAuth from './src/routers/routerAuth.js'
import routerSalao from './src/routers/routerSalao.js'
import routerDono from './src/routers/routerDono.js'


//import dotenv from 'dotenv'

//dotenv.config() 

dotenv.config() // lê o arquivo .env para pegar as configurações

const app = express() // cria o servidor
const __dirname = path.dirname(fileURLToPath(import.meta.url))

let PORT = process.env.EXPRESS_PORT   // porta onde o sistema vai rodar (padrão 3000)
let HOST = process.env.EXPRESS_HOST  // endereço do servidor (padrão localhost)

if(process.env.MODE_NODE === 'dev'){
    PORT = 3000
    HOST = 'localhost'
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))                         // lê o ?_method= nos formulários e converte para PUT ou DELETE

app.use(session({
    secret: process.env.SESSION_SECRET || 'salao-secret', // chave para assinar o cookie de sessão
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, 'src', 'public'))) // diz onde ficam os arquivos HTML, CSS e JS

app.set('view engine', 'ejs')                                          // configura o EJS como motor de templates
app.set('views', path.join(__dirname, 'src', 'views'))      // diz onde ficam as páginas EJS

// MIDDLEWARE GLOBAL para passar os dados da sessão para as views EJS
// Isso permite que header.ejs e outras páginas acessem o usuário logado
// res.locals é um objeto que fica disponível em todas as views renderizadas
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario // passa req.session.usuario para toda view renderizada
    next()
})

app.use(routerAuth)         // liga as rotas de autenticação ao servidor
app.use(routerSalao)         // liga as rotas de salões ao servidor
app.use(routerDono)         // liga as rotas de donos ao servidor
app.use(routerCliente)      // liga as rotas de clientes ao servidor
app.use(routerAgendamento)  // liga as rotas de agendamentos ao servidor

// rota principal - redireciona para o login
app.get('/', (req, res) => {
    res.redirect('/login')
})

// inicia o sistema: espera o banco estar pronto antes de abrir o servidor
const iniciar = async () => {
    await sincronizarBD()  // espera o banco sincronizar
    app.listen(PORT, HOST, () => {
        console.log(`Servidor rodando em http://${HOST}:${PORT}`)
    })
}

iniciar()
