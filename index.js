import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import methodOverride from 'method-override'
import session from 'express-session'
import { sincronizarBD } from './src/config/orm.js'
import routerSolicitacao from './src/routers/routerSolicitacao.js'
import routerVitrine from './src/routers/routerVitrine.js'
import routerCliente from './src/routers/routerCliente.js'
import routerAgendamento from './src/routers/routerAgendamento.js'
import routerAuth from './src/routers/routerAuth.js'
import routerSalao from './src/routers/routerSalao.js'
import routerDono from './src/routers/routerDono.js'


dotenv.config() // lê o arquivo .env para pegar as configurações

const app = express() // cria o servidor
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || process.env.EXPRESS_PORT || 3000
const HOST = process.env.EXPRESS_HOST || 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))                         // lê o ?_method= nos formulários e converte para PUT ou DELETE

app.use(session({
    secret: process.env.SESSION_SECRET || 'salao-secret', // chave para assinar o cookie de sessão
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, 'src', 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario
    next()
})

// rota principal - redireciona para o login
app.get('/', (req, res) => {
    res.redirect('/login')
})

app.use(routerAuth)
app.use(routerSalao)
app.use(routerDono)
app.use(routerSolicitacao)
app.use(routerVitrine)
app.use(routerCliente)
app.use(routerAgendamento) // diz onde ficam os arquivos HTML, CSS e JS

// rede de segurança para erros não tratados
app.use((err, req, res, next) => {
    res.status(500).render('erro', { mensagem: 'Deu bronca, contate o suporte' })
})

// inicia o sistema: espera o banco estar pronto antes de abrir o servidor
const iniciar = async () => {
    await sincronizarBD()  // espera o banco sincronizar
    app.listen(PORT, HOST, () => {
        console.log(`Servidor rodando em http://${HOST}:${PORT}`)
    })
}

iniciar()
