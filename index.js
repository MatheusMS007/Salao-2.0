import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import dotenv from 'dotenv'
import methodOverride from 'method-override'
import session from 'express-session'
import { sincronizarBD } from './src/config/orm.js'
import routerCliente from './src/routers/routerCliente.js'
import routerAgendamento from './src/routers/routerAgendamento.js'
import routerAuth from './src/routers/routerAuth.js'
import routerSalao from './src/routers/routerSalao.js'

dotenv.config() // lê o arquivo .env para pegar as configurações

const app = express() // cria o servidor
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 3000   // porta onde o sistema vai rodar (padrão 3000)
const HOST = process.env.HOST || 'localhost' // endereço do servidor (padrão localhost)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))                         // lê o ?_method= nos formulários e converte para PUT ou DELETE
app.use(morgan('common'))
app.use(session({
    secret: process.env.SESSION_SECRET || 'salao-secret', // chave para assinar o cookie de sessão
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, 'src', 'public'))) // diz onde ficam os arquivos HTML, CSS e JS

app.set('view engine', 'ejs')                                          // configura o EJS como motor de templates
app.set('views', path.join(__dirname, 'src', 'views'))      // diz onde ficam as páginas EJS

app.use(routerAuth)         // liga as rotas de autenticação ao servidor
app.use(routerSalao)         // liga as rotas de salões ao servidor
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
