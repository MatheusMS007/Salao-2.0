import express from 'express'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
import methodOverride from 'method-override'
import { sincronizarBD } from './src/config/orm.js'
import './src/models/modelCliente.js'      // registra o model de clientes no sequelize
import './src/models/modelAgendamento.js'  // registra o model de agendamentos no sequelize
import routerCliente from './src/routers/routerCliente.js'
import routerAgendamento from './src/routers/routerAgendamento.js'

dotenv.config() // lê o arquivo .env para pegar as configurações

const app = express() // cria o servidor

const PORT = process.env.PORT || 3000   // porta onde o sistema vai rodar (padrão 3000)
const HOST = process.env.HOST || 'localhost' // endereço do servidor (padrão localhost)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))                         // lê o ?_method= nos formulários e converte para PUT ou DELETE
app.use(morgan('common'))

app.use(express.static(path.join(import.meta.dirname, 'src', 'public'))) // diz onde ficam os arquivos HTML, CSS e JS

app.set('view engine', 'ejs')                                          // configura o EJS como motor de templates
app.set('views', path.join(import.meta.dirname, 'src', 'views'))      // diz onde ficam as páginas EJS

app.use(routerCliente)      // liga as rotas de clientes ao servidor
app.use(routerAgendamento)  // liga as rotas de agendamentos ao servidor

// rota principal - quando acessar http://localhost:3000 abre a página inicial
app.get('/', (req, res) => {
    res.redirect('/clientes') // redireciona para a lista de clientes
})

// inicia o sistema: espera o banco estar pronto antes de abrir o servidor
const iniciar = async () => {
    await sincronizarBD()  // espera o banco sincronizar
    app.listen(PORT, HOST, () => {
        console.log(`Servidor rodando em http://${HOST}:${PORT}`) // mostra no terminal que o servidor está funcionando
    })
}

iniciar()
