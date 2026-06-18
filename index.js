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


dotenv.config()

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || process.env.EXPRESS_PORT || 3000
const HOST = process.env.EXPRESS_HOST || 'localhost'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
    secret: process.env.SESSION_SECRET || 'salao-secret',
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

app.get('/', (req, res) => {
    res.redirect('/vitrine')
})

app.use(routerAuth)
app.use(routerSalao)
app.use(routerDono)
app.use(routerSolicitacao)
app.use(routerVitrine)
app.use(routerCliente)
app.use(routerAgendamento)

app.use((err, req, res, next) => {
    res.status(500).render('erro', { mensagem: 'Deu bronca, contate o suporte' })
})

const iniciar = async () => {
    await sincronizarBD()
    app.listen(PORT, HOST, () => {
        console.log(`Servidor rodando em http://${HOST}:${PORT}`)
    })
}

iniciar()
