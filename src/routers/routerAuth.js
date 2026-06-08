import express from 'express'
import { exibirLogin, fazerLogin, fazerLogout, criarAdm } from '../controllers/controllersAuth.js'

const routerAuth = express.Router()

routerAuth.get('/login', exibirLogin)       // abre a página de login
routerAuth.post('/login', fazerLogin)       // processa o login
routerAuth.post('/logout', fazerLogout)     // faz o logout
routerAuth.get('/setup', criarAdm)          // cria o ADM master (usar apenas uma vez e depois remover)

export default routerAuth
